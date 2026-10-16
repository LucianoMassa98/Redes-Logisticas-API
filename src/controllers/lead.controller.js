import { leadService } from '../services/lead.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const createLead = async (req, res, next) => {
  try {
    const result = await leadService.createPublicLead(req.body);
    return sendCreated(
      res,
      result,
      'Solicitud de presupuesto registrada correctamente. Un asesor se comunicará a la brevedad.'
    );
  } catch (error) {
    next(error);
  }
};

export const createAdminLead = async (req, res, next) => {
  try {
    const result = await leadService.createAdminLead(req.body, req.user);
    return sendCreated(
      res,
      result,
      'Lead registrado en el sistema correctamente'
    );
  } catch (error) {
    next(error);
  }
};

export const getLead = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    return sendSuccess(res, lead, 'Detalle de lead obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

export const listLeads = async (req, res, next) => {
  try {
    const paginatedLeads = await leadService.listLeads(req.query);
    return sendSuccess(res, paginatedLeads, 'Listado de leads obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const updated = await leadService.updateLead(req.params.id, req.body, req.user);
    return sendSuccess(res, updated, 'Lead actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const updated = await leadService.updateStatus(req.params.id, status, req.user, note);
    return sendSuccess(res, updated, 'Estado del lead actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const updateAssignment = async (req, res, next) => {
  try {
    const { assignedUserId } = req.body;
    const updated = await leadService.updateAssignment(req.params.id, assignedUserId, req.user);
    return sendSuccess(res, updated, 'Asignación de responsable actualizada');
  } catch (error) {
    next(error);
  }
};

export const addNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    const note = await leadService.addNote(req.params.id, content, req.user);
    return sendCreated(res, note, 'Nota interna agregada correctamente');
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const notes = await leadService.getNotes(req.params.id);
    return sendSuccess(res, notes, 'Notas del lead obtenidas');
  } catch (error) {
    next(error);
  }
};

export const addActivity = async (req, res, next) => {
  try {
    const { activityType, description, metadata } = req.body;
    const activity = await leadService.addActivity(req.params.id, activityType, description, metadata, req.user);
    return sendCreated(res, activity, 'Actividad registrada correctamente');
  } catch (error) {
    next(error);
  }
};

export const getActivities = async (req, res, next) => {
  try {
    const activities = await leadService.getActivities(req.params.id);
    return sendSuccess(res, activities, 'Historial de actividades obtenido');
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req, res, next) => {
  try {
    const csvContent = await leadService.exportLeads(req.query);
    const filename = `leads_export_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send('\uFEFF' + csvContent); // BOM for Excel UTF-8 compatibility
  } catch (error) {
    next(error);
  }
};
