import { presetService } from '../services/preset.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const listPresets = async (req, res, next) => {
  try {
    const presets = await presetService.listPresets(req.query);
    return sendSuccess(res, presets, 'Plantillas de instalación obtenidas');
  } catch (error) {
    next(error);
  }
};

export const getPresetById = async (req, res, next) => {
  try {
    const preset = await presetService.getPresetById(req.params.id);
    return sendSuccess(res, preset, 'Detalle de la plantilla obtenido');
  } catch (error) {
    next(error);
  }
};

export const createPreset = async (req, res, next) => {
  try {
    const created = await presetService.createPreset(req.body);
    return sendCreated(res, created, 'Plantilla de instalación creada correctamente');
  } catch (error) {
    next(error);
  }
};

export const updatePreset = async (req, res, next) => {
  try {
    const updated = await presetService.updatePreset(req.params.id, req.body);
    return sendSuccess(res, updated, 'Plantilla actualizada correctamente');
  } catch (error) {
    next(error);
  }
};

export const deletePreset = async (req, res, next) => {
  try {
    const result = await presetService.deletePreset(req.params.id);
    return sendSuccess(res, result, 'Plantilla eliminada correctamente');
  } catch (error) {
    next(error);
  }
};
