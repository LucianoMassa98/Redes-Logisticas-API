import Boom from '@hapi/boom';
import { ScheduleRepository } from '../repositories/schedule.repository.js';
import { LeadRepository } from '../repositories/lead.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { ACTIVITY_TYPES, LEAD_STATUSES, INSTALLATION_STATUSES } from '../utils/constants.js';

const scheduleRepository = new ScheduleRepository();
const leadRepository = new LeadRepository();

// Calcula la hora de finalización en base a la hora de inicio y minutos
const calculateEndTime = (startTime, durationMinutes = 120) => {
  if (!startTime) return '11:00';
  const [hours, minutes] = startTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return startTime;

  const totalMinutes = hours * 60 + minutes + Number(durationMinutes);
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};

export class ScheduleService {
  async listSchedules(query = {}) {
    return scheduleRepository.findAll(query);
  }

  async getScheduleById(id) {
    const schedule = await scheduleRepository.findById(id);
    if (!schedule) {
      throw Boom.notFound('Instalación programada no encontrada.');
    }
    return schedule;
  }

  async getCalendarStats(query = {}) {
    return scheduleRepository.getMetrics(query);
  }

  async createSchedule(data, currentUserId = null) {
    const {
      leadId,
      presetId,
      assignedUserId,
      title,
      clientName,
      clientPhone,
      clientEmail,
      clientAddress,
      locality,
      serviceType = 'GENERAL',
      scheduledDate,
      startTime = '09:00',
      durationMinutes = 120,
      technicianName,
      status = INSTALLATION_STATUSES.CONFIRMED,
      priority = 'NORMAL',
      estimatedPrice = 0,
      materials = [],
      notes,
    } = data;

    const endTime = data.endTime || calculateEndTime(startTime, durationMinutes);

    const scheduleData = {
      leadId: leadId || null,
      presetId: presetId || null,
      assignedUserId: assignedUserId || currentUserId || null,
      title: title.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail ? clientEmail.trim().toLowerCase() : null,
      clientAddress: clientAddress.trim(),
      locality: locality ? locality.trim() : null,
      serviceType,
      scheduledDate,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 120,
      technicianName: technicianName ? technicianName.trim() : null,
      status,
      priority,
      estimatedPrice: Number(estimatedPrice) || 0,
      materials: Array.isArray(materials) ? materials : [],
      notes: notes ? notes.trim() : null,
    };

    const createdSchedule = await scheduleRepository.create(scheduleData);

    // Si está asociado a un lead existente, actualizar su estado y registrar la actividad
    if (leadId) {
      try {
        const lead = await leadRepository.findById(leadId);
        if (lead) {
          // Si el lead está en NEW o CONTACTED, avanzar a VISIT_SCHEDULED
          if (lead.status === LEAD_STATUSES.NEW || lead.status === LEAD_STATUSES.CONTACTED) {
            await leadRepository.update(leadId, { status: LEAD_STATUSES.VISIT_SCHEDULED });
          }

          // Registrar en el historial de actividades del lead
          await activityRepository.create({
            leadId,
            userId: currentUserId,
            activityType: ACTIVITY_TYPES.INSTALLATION_SCHEDULED || ACTIVITY_TYPES.VISIT_SCHEDULED,
            description: `Instalación programada: "${scheduleData.title}" para el día ${scheduledDate} a las ${startTime} hs con el técnico ${scheduleData.technicianName || 'A designar'}.`,
            metadata: {
              scheduleId: createdSchedule.id,
              scheduledDate,
              startTime,
              serviceType,
              technicianName: scheduleData.technicianName,
            },
          });
        }
      } catch (logErr) {
        console.warn('[SCHEDULE LOG WARNING] No se pudo registrar la actividad en el lead:', logErr.message);
      }
    }

    return scheduleRepository.findById(createdSchedule.id);
  }

  async updateSchedule(id, data, currentUserId = null) {
    const existing = await scheduleRepository.findById(id);
    if (!existing) {
      throw Boom.notFound('Instalación programada no encontrada.');
    }

    const updatePayload = { ...data };

    if (updatePayload.title) updatePayload.title = updatePayload.title.trim();
    if (updatePayload.clientName) updatePayload.clientName = updatePayload.clientName.trim();
    if (updatePayload.clientPhone) updatePayload.clientPhone = updatePayload.clientPhone.trim();
    if (updatePayload.clientAddress) updatePayload.clientAddress = updatePayload.clientAddress.trim();
    if (updatePayload.locality !== undefined) updatePayload.locality = updatePayload.locality ? updatePayload.locality.trim() : null;
    if (updatePayload.technicianName !== undefined) updatePayload.technicianName = updatePayload.technicianName ? updatePayload.technicianName.trim() : null;
    if (updatePayload.notes !== undefined) updatePayload.notes = updatePayload.notes ? updatePayload.notes.trim() : null;

    // Recalcular hora de finalización si cambia inicio o duración
    const newStartTime = updatePayload.startTime || existing.startTime;
    const newDuration = updatePayload.durationMinutes !== undefined ? updatePayload.durationMinutes : existing.durationMinutes;
    if (!updatePayload.endTime) {
      updatePayload.endTime = calculateEndTime(newStartTime, newDuration);
    }

    // Si cambia a COMPLETED, guardar timestamp
    if (updatePayload.status === INSTALLATION_STATUSES.COMPLETED && existing.status !== INSTALLATION_STATUSES.COMPLETED) {
      updatePayload.completedAt = new Date();
    }

    await scheduleRepository.update(id, updatePayload);

    // Si tiene un lead asociado, registrar la reprogramación o cambio
    if (existing.leadId && (updatePayload.scheduledDate || updatePayload.startTime || updatePayload.status)) {
      try {
        await activityRepository.create({
          leadId: existing.leadId,
          userId: currentUserId,
          activityType: ACTIVITY_TYPES.DATA_UPDATED,
          description: `Instalación "${existing.title}" modificada. Fecha: ${updatePayload.scheduledDate || existing.scheduledDate} a las ${updatePayload.startTime || existing.startTime} hs. Estado: ${updatePayload.status || existing.status}.`,
          metadata: {
            scheduleId: id,
            changes: updatePayload,
          },
        });
      } catch (logErr) {
        console.warn('[SCHEDULE LOG WARNING] No se pudo registrar la actualización en el lead:', logErr.message);
      }
    }

    return scheduleRepository.findById(id);
  }

  async updateStatus(id, { status, notes }, currentUserId = null) {
    const existing = await scheduleRepository.findById(id);
    if (!existing) {
      throw Boom.notFound('Instalación programada no encontrada.');
    }

    const updatePayload = { status };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    if (status === INSTALLATION_STATUSES.COMPLETED) {
      updatePayload.completedAt = new Date();
    }

    await scheduleRepository.update(id, updatePayload);

    // Si tiene lead asociado y se completa, opcionalmente podemos avanzar el lead a WON
    if (existing.leadId) {
      try {
        if (status === INSTALLATION_STATUSES.COMPLETED) {
          await leadRepository.update(existing.leadId, { status: LEAD_STATUSES.WON });
        }

        await activityRepository.create({
          leadId: existing.leadId,
          userId: currentUserId,
          activityType: ACTIVITY_TYPES.STATUS_CHANGED,
          description: `Estado de la instalación "${existing.title}" actualizado a "${status}".`,
          metadata: { scheduleId: id, newStatus: status, notes },
        });
      } catch (logErr) {
        console.warn('[SCHEDULE LOG WARNING] No se pudo actualizar el lead:', logErr.message);
      }
    }

    return scheduleRepository.findById(id);
  }

  async deleteSchedule(id) {
    const existing = await scheduleRepository.findById(id);
    if (!existing) {
      throw Boom.notFound('Instalación programada no encontrada.');
    }

    await scheduleRepository.delete(id);
    return { success: true, message: 'Instalación eliminada exitosamente.' };
  }
}
