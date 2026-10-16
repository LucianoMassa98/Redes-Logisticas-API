import { quoteService } from '../services/quote.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';

export const listQuotes = async (req, res, next) => {
  try {
    const quotes = await quoteService.listQuotes(req.query);
    return sendSuccess(res, quotes, 'Presupuestos obtenidos correctamente');
  } catch (error) {
    next(error);
  }
};

export const createQuote = async (req, res, next) => {
  try {
    const quote = await quoteService.createQuote(req.body, req.user);
    return sendCreated(res, quote, 'Presupuesto creado correctamente');
  } catch (error) {
    next(error);
  }
};

export const updateQuote = async (req, res, next) => {
  try {
    const updated = await quoteService.updateQuote(req.params.id, req.body, req.user);
    return sendSuccess(res, updated, 'Presupuesto actualizado correctamente');
  } catch (error) {
    next(error);
  }
};
