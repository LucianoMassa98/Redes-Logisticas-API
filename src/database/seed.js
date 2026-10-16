import path from 'path';
import { fileURLToPath } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import { sequelize, testConnection } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSeeder = (seq = sequelize) => {
  if (!seq) {
    throw new Error('No hay conexión de base de datos activa configurada.');
  }

  const seedersPath = path.join(__dirname, 'seeders', '*.js').replace(/\\/g, '/');

  return new Umzug({
    migrations: {
      glob: seedersPath,
      resolve: ({ name, path: filepath }) => {
        return {
          name,
          up: async (params) => {
            const seeder = await import(`file://${filepath}`);
            return seeder.up({ ...params, Sequelize });
          },
          down: async (params) => {
            const seeder = await import(`file://${filepath}`);
            return seeder.down({ ...params, Sequelize });
          },
        };
      },
    },
    context: seq.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize: seq, tableName: 'sequelize_data' }),
    logger: console,
  });
};

const runCli = async () => {
  console.log('[SEEDER] Ejecutando seeders del sistema...');
  const conn = await testConnection();
  if (!conn.ok) {
    console.error(`[SEEDER ERROR] No se puede conectar a la base de datos: ${conn.message}`);
    process.exit(1);
  }

  const seeder = getSeeder(sequelize);

  try {
    const executed = await seeder.up();
    if (executed.length === 0) {
      console.log('[SEEDER] Todos los seeders ya fueron aplicados.');
    } else {
      console.log(`[SEEDER] ${executed.length} seeders ejecutados:`);
      executed.forEach((s) => console.log(`  ✓ ${s.name}`));
    }
    process.exit(0);
  } catch (err) {
    console.error('[SEEDER ERROR] Error al ejecutar seeders:', err);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runCli();
}
