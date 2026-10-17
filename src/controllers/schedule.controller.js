import { ScheduleService } from '../services/schedule.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

const scheduleService = new ScheduleService();

export const listSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.listSchedules(req.query);
    return sendSuccess(res, schedules, 'Instalaciones programadas obtenidas exitosamente');
  } catch (error) {
    next(error);
  }
};

export const getCalendarStats = async (req, res, next) => {
  try {
    const stats = await scheduleService.getCalendarStats(req.query);
    return sendSuccess(res, stats, 'Métricas del calendario obtenidas');
  } catch (error) {
    next(error);
  }
};

export const getScheduleById = async (req, res, next) => {
  try {
    const schedule = await scheduleService.getScheduleById(req.params.id);
    return sendSuccess(res, schedule, 'Detalle de instalación obtenido');
  } catch (error) {
    next(error);
  }
};

export const createSchedule = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const created = await scheduleService.createSchedule(req.body, currentUserId);
    return sendCreated(res, created, 'Instalación programada creada exitosamente');
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const updated = await scheduleService.updateSchedule(req.params.id, req.body, currentUserId);
    return sendSuccess(res, updated, 'Instalación programada actualizada exitosamente');
  } catch (error) {
    next(error);
  }
};

export const updateScheduleStatus = async (req, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const updated = await scheduleService.updateStatus(req.params.id, req.body, currentUserId);
    return sendSuccess(res, updated, 'Estado de la instalación actualizado');
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const result = await scheduleService.deleteSchedule(req.params.id);
    return sendSuccess(res, result, 'Instalación programada eliminada correctamente');
  } catch (error) {
    next(error);
  }
};
