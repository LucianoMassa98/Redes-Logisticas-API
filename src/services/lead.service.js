import Boom from '@hapi/boom';
import { sequelize } from '../config/database.js';
import { leadRepository } from '../repositories/lead.repository.js';
import { serviceRepository } from '../repositories/service.repository.js';
import { noteRepository } from '../repositories/note.repository.js';
import { activityRepository } from '../repositories/activity.repository.js';
import { normalizePhoneNumber } from '../utils/phone.util.js';
import { leadsToCsv } from '../utils/csv.util.js';
import { LEAD_STATUSES, ACTIVITY_TYPES } from '../utils/constants.js';

export class LeadService {
  async createPublicLead(inputData) {
    const {
      fullName,
      phone,
      email,
      address,
      locality,
      province,
      customerType,
      services,
      latitude,
      longitude,
      locationReference,
      description,
      preferredContactMethod,
    } = inputData;

    // Normalizar teléfono
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone || normalizedPhone.length < 8) {
      throw Boom.badRequest('El número de teléfono proporcionado no es válido o está incompleto.');
    }

    // Resolver y validar servicios solicitados
    const resolvedServices = await serviceRepository.resolveServices(services);
    if (!resolvedServices || resolvedServices.length === 0) {
      throw Boom.badRequest('Al menos uno de los servicios seleccionados no existe o no se encuentra disponible.');
    }

    const serviceIds = resolvedServices.map((s) => s.id);

    // Ejecutar creación en transacción
    const t = await sequelize.transaction();

    try {
      const leadData = {
        fullName: fullName.trim(),
        phone: normalizedPhone,
        email: email ? email.trim().toLowerCase() : null,
        address: address.trim(),
        locality: locality.trim(),
        province: province ? province.trim() : 'Argentina',
        customerType,
        latitude: latitude || null,
        longitude: longitude || null,
        locationReference: locationReference ? locationReference.trim() : null,
        description: description ? description.trim() : null,
        preferredContactMethod: preferredContactMethod || 'WHATSAPP',
        status: LEAD_STATUSES.NEW, // Obligatoriamente NEW para solicitudes de landing
        source: 'LANDING_PAGE',
        privacyPolicyVersion: '1.0',
        privacyAcceptedAt: new Date(),
      };

      const createdLead = await leadRepository.createWithServices(leadData, serviceIds, t);

      // Registrar actividad inicial en el historial
      const serviceNames = resolvedServices.map((s) => s.name).join(', ');
      await activityRepository.create(
        {
          leadId: createdLead.id,
          userId: null, // Evento del sistema
          activityType: ACTIVITY_TYPES.LEAD_CREATED,
          description: `Solicitud de presupuesto registrada desde la landing page para los servicios: ${serviceNames}.`,
          metadata: {
            customerType,
            locality: leadData.locality,
            services: resolvedServices.map((s) => ({ id: s.id, code: s.code, name: s.name })),
          },
        },
        t
      );

      await t.commit();

      return {
        id: createdLead.id,
        fullName: createdLead.fullName,
        locality: createdLead.locality,
        createdAt: createdLead.createdAt,
      };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async createAdminLead(inputData, currentUser) {
    const {
      fullName,
      phone,
      email,
      address,
      locality,
      province,
      customerType,
      services,
      latitude,
      longitude,
      locationReference,
      description,
      preferredContactMethod,
      status = LEAD_STATUSES.NEW,
      assignedUserId = null,
      source = 'MANUAL_ADMIN',
      initialNote = null,
    } = inputData;

    // Normalizar teléfono
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone || normalizedPhone.length < 8) {
      throw Boom.badRequest('El número de teléfono proporcionado no es válido o está incompleto.');
    }

    // Resolver y validar servicios solicitados
    const resolvedServices = await serviceRepository.resolveServices(services);
    if (!resolvedServices || resolvedServices.length === 0) {
      throw Boom.badRequest('Al menos uno de los servicios seleccionados no existe o no se encuentra disponible.');
    }

    const serviceIds = resolvedServices.map((s) => s.id);

    const t = await sequelize.transaction();

    try {
      const leadData = {
        fullName: fullName.trim(),
        phone: normalizedPhone,
        email: email ? email.trim().toLowerCase() : null,
        address: address.trim(),
        locality: locality.trim(),
        province: province ? province.trim() : 'Argentina',
        customerType,
        latitude: latitude || null,
        longitude: longitude || null,
        locationReference: locationReference ? locationReference.trim() : null,
        description: description ? description.trim() : null,
        preferredContactMethod: preferredContactMethod || 'WHATSAPP',
        status,
        assignedUserId: assignedUserId || null,
        source: source.trim() || 'MANUAL_ADMIN',
        privacyPolicyVersion: '1.0',
        privacyAcceptedAt: new Date(),
      };

      const createdLead = await leadRepository.createWithServices(leadData, serviceIds, t);

      // Registrar actividad de creación manual por parte del operador
      const serviceNames = resolvedServices.map((s) => s.name).join(', ');
      await activityRepository.create(
        {
          leadId: createdLead.id,
          userId: currentUser?.id || null,
          activityType: ACTIVITY_TYPES.LEAD_CREATED,
          description: `Lead registrado manualmente por ${currentUser?.fullName || 'Administración'} con los servicios: ${serviceNames}.`,
          metadata: {
            customerType,
            locality: leadData.locality,
            source: leadData.source,
            initialStatus: status,
            services: resolvedServices.map((s) => ({ id: s.id, code: s.code, name: s.name })),
          },
        },
        t
      );

      // Si se incluyó una nota interna inicial
      if (initialNote && initialNote.trim()) {
        await noteRepository.create(
          {
            leadId: createdLead.id,
            userId: currentUser?.id || null,
            content: initialNote.trim(),
          },
          t
        );
      }

      await t.commit();

      return this.getLeadById(createdLead.id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getLeadById(id) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw Boom.notFound('El lead solicitado no existe.');
    }
    return lead;
  }

  async listLeads(filterOptions) {
    return leadRepository.findAllPaginated(filterOptions);
  }

  async exportLeads(filterOptions) {
    const leads = await leadRepository.findAllForExport(filterOptions);
    return leadsToCsv(leads);
  }

  async updateLead(id, updateData, user) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw Boom.notFound('El lead solicitado no existe.');
    }

    const t = await sequelize.transaction();

    try {
      const payload = { ...updateData };

      // Si actualizan teléfono, normalizarlo
      if (payload.phone) {
        payload.phone = normalizePhoneNumber(payload.phone);
      }

      // Si actualizan servicios
      if (payload.services) {
        const resolved = await serviceRepository.resolveServices(payload.services);
        const serviceIds = resolved.map((s) => s.id);
        await leadRepository.syncServices(id, serviceIds, t);
        delete payload.services;
      }

      await leadRepository.update(id, payload, t);

      await activityRepository.create(
        {
          leadId: id,
          userId: user.id,
          activityType: ACTIVITY_TYPES.DATA_UPDATED,
          description: `Datos del lead actualizados por ${user.fullName}.`,
          metadata: { updatedFields: Object.keys(payload) },
        },
        t
      );

      await t.commit();
      return this.getLeadById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async updateStatus(id, newStatus, user, noteContent = null) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw Boom.notFound('El lead solicitado no existe.');
    }

    if (lead.status === newStatus) {
      return lead;
    }

    const oldStatus = lead.status;
    const t = await sequelize.transaction();

    try {
      await leadRepository.update(id, { status: newStatus }, t);

      let activityType = ACTIVITY_TYPES.STATUS_CHANGED;
      if (newStatus === LEAD_STATUSES.WON) activityType = ACTIVITY_TYPES.LEAD_WON;
      if (newStatus === LEAD_STATUSES.LOST) activityType = ACTIVITY_TYPES.LEAD_LOST;

      await activityRepository.create(
        {
          leadId: id,
          userId: user.id,
          activityType,
          description: `Estado comercial cambiado de "${oldStatus}" a "${newStatus}" por ${user.fullName}.`,
          metadata: { from: oldStatus, to: newStatus },
        },
        t
      );

      if (noteContent && noteContent.trim() !== '') {
        await noteRepository.create(
          {
            leadId: id,
            userId: user.id,
            content: `[Cambio a ${newStatus}]: ${noteContent.trim()}`,
          },
          t
        );
      }

      await t.commit();
      return this.getLeadById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async updateAssignment(id, assignedUserId, user) {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw Boom.notFound('El lead solicitado no existe.');
    }

    const t = await sequelize.transaction();

    try {
      await leadRepository.update(id, { assignedUserId: assignedUserId || null }, t);

      await activityRepository.create(
        {
          leadId: id,
          userId: user.id,
          activityType: ACTIVITY_TYPES.ASSIGNMENT_CHANGED,
          description: assignedUserId
            ? `Lead reasignado a usuario ${assignedUserId} por ${user.fullName}.`
            : `Lead desasignado por ${user.fullName}.`,
          metadata: { previousAssignedUser: lead.assignedUserId, newAssignedUser: assignedUserId },
        },
        t
      );

      await t.commit();
      return this.getLeadById(id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async addNote(leadId, content, user) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw Boom.notFound('El lead no existe.');
    }

    const t = await sequelize.transaction();

    try {
      const note = await noteRepository.create(
        {
          leadId,
          userId: user.id,
          content: content.trim(),
        },
        t
      );

      await activityRepository.create(
        {
          leadId,
          userId: user.id,
          activityType: ACTIVITY_TYPES.NOTE_ADDED,
          description: `Nota interna añadida por ${user.fullName}.`,
        },
        t
      );

      await t.commit();
      return note;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getNotes(leadId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw Boom.notFound('El lead no existe.');
    }
    return noteRepository.findByLeadId(leadId);
  }

  async addActivity(leadId, activityType, description, metadata, user) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw Boom.notFound('El lead no existe.');
    }

    const t = await sequelize.transaction();

    try {
      const activity = await activityRepository.create(
        {
          leadId,
          userId: user.id,
          activityType,
          description: description.trim(),
          metadata: metadata || null,
        },
        t
      );

      // Si es un contacto realizado o visita, actualizar last_contact_at
      if (activityType === ACTIVITY_TYPES.CONTACT_MADE || activityType === ACTIVITY_TYPES.VISIT_SCHEDULED) {
        await leadRepository.update(leadId, { lastContactAt: new Date() }, t);
      }

      await t.commit();
      return activity;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getActivities(leadId) {
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw Boom.notFound('El lead no existe.');
    }
    return activityRepository.findByLeadId(leadId);
  }
}

export const leadService = new LeadService();
