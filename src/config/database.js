import { Sequelize } from 'sequelize';
import { config } from './env.js';

const getSequelizeConfig = () => {
  const isPostgres = config.database.url && config.database.url.startsWith('postgres');

  const dialectOptions = {};

  if (isPostgres && config.database.ssl) {
    dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: config.database.rejectUnauthorized,
    };
  }

  return {
    dialect: 'postgres',
    logging: config.isProduction ? false : (msg) => {
      // Filter out sensitive logs if any
      if (!msg.includes('password')) {
        // console.log(msg); // Descomentar para debug detallado en desarrollo
      }
    },
    pool: config.database.pool,
    dialectOptions,
    define: {
      underscored: true,
      timestamps: true,
    },
  };
};

export const createSequelizeInstance = (customUrl = null) => {
  const dbUrl = customUrl || config.database.url;

  if (!dbUrl) {
    throw new Error('DATABASE_URL no configurada en las variables de entorno.');
  }

  return new Sequelize(dbUrl, getSequelizeConfig());
};

export const sequelize = config.database.url ? createSequelizeInstance() : null;

export const testConnection = async (instance = sequelize) => {
  if (!instance) {
    throw new Error('No hay instancia de Sequelize inicializada. Verifica DATABASE_URL.');
  }
  try {
    await instance.authenticate();
    // Test with a simple query
    await instance.query('SELECT 1+1 AS result');
    return { ok: true, message: 'Conexión a la base de datos establecida exitosamente.' };
  } catch (error) {
    return {
      ok: false,
      message: `Error al conectar a la base de datos: ${error.message}`,
      error,
    };
  }
};
