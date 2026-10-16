import { sequelize, testConnection } from '../config/database.js';
import { config } from '../config/env.js';
import { initModels } from '../models/index.js';
import { USER_ROLES } from '../utils/constants.js';

const run = async () => {
  console.log('[ADMIN SEED] Iniciando creación de usuario administrador...');

  const conn = await testConnection();
  if (!conn.ok) {
    console.error(`[ADMIN SEED ERROR] No hay conexión a base de datos: ${conn.message}`);
    process.exit(1);
  }

  const { User } = initModels(sequelize);

  const { name, email, password } = config.adminInitial;

  if (!email || !password) {
    console.error('[ADMIN SEED ERROR] ADMIN_INITIAL_EMAIL y ADMIN_INITIAL_PASSWORD son obligatorios.');
    process.exit(1);
  }

  try {
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log(`[ADMIN SEED] El usuario administrador con email "${email}" ya existe (ID: ${existing.id}). No se aplicaron cambios.`);
      process.exit(0);
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      fullName: name,
      email,
      passwordHash,
      role: USER_ROLES.ADMIN,
      isActive: true,
    });

    console.log(`[ADMIN SEED] Usuario administrador creado exitosamente:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Nombre: ${user.fullName}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Rol: ${user.role}`);
    process.exit(0);
  } catch (err) {
    console.error('[ADMIN SEED ERROR] Error al crear administrador:', err.message);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith('createAdmin.js')) {
  run();
}
