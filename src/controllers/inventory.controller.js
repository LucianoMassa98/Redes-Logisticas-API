import { inventoryService } from '../services/inventory.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const getInventory = async (req, res, next) => {
  try {
    const data = await inventoryService.getInventory(req.query);
    return sendSuccess(res, data, 'Inventario obtenido correctamente');
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    const item = await inventoryService.getItemById(req.params.id);
    return sendSuccess(res, item, 'Detalle de artículo obtenido');
  } catch (error) {
    next(error);
  }
};

export const createItem = async (req, res, next) => {
  try {
    const item = await inventoryService.createItem(req.body);
    return sendCreated(res, item, 'Artículo agregado al inventario exitosamente');
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await inventoryService.updateItem(req.params.id, req.body);
    return sendSuccess(res, item, 'Artículo actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    const item = await inventoryService.adjustStock(req.params.id, req.body);
    return sendSuccess(res, item, 'Stock actualizado correctamente');
  } catch (error) {
    next(error);
  }
};

export const calculateQuotePrice = async (req, res, next) => {
  try {
    const calculation = await inventoryService.calculateQuotePrice(req.body);
    return sendSuccess(res, calculation, 'Cálculo de precio e instalación completado');
  } catch (error) {
    next(error);
  }
};

export const getConfig = async (req, res, next) => {
  try {
    const configData = inventoryService.getSystemConfig();
    return sendSuccess(res, configData, 'Configuración de cálculo de precios obtenida');
  } catch (error) {
    next(error);
  }
};
