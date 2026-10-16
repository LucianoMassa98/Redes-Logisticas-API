import { sequelize, testConnection } from '../config/database.js';

export const connectDatabase = async () => {
  if (!sequelize) {
    console.warn('[DATABASE] DATABASE_URL no configurada. Servidor operando sin conexión activa a base de datos.');
    return false;
  }

  const result = await testConnection(sequelize);
  if (result.ok) {
    console.log('[DATABASE] ' + result.message);
    return true;
  } else {
    console.error('[DATABASE ERROR] ' + result.message);
    return false;
  }
};

export const closeDatabase = async () => {
  if (sequelize) {
    try {
      await sequelize.close();
      console.log('[DATABASE] Conexión cerrada de forma ordenada.');
    } catch (err) {
      console.error('[DATABASE ERROR] Error al cerrar conexión:', err.message);
    }
  }
};

export { sequelize, testConnection };
