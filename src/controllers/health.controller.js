import { testConnection } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

export const getHealth = (req, res) => {
  return sendSuccess(
    res,
    {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    'Servidor operativo'
  );
};

export const getReadiness = async (req, res) => {
  const result = await testConnection();

  if (result.ok) {
    return sendSuccess(
      res,
      {
        status: 'READY',
        database: 'CONNECTED',
        timestamp: new Date().toISOString(),
      },
      'Servidor y base de datos listos para operar'
    );
  } else {
    return sendError(
      res,
      'Base de datos no disponible o error de conectividad',
      [{ database: 'DISCONNECTED' }],
      503
    );
  }
};
