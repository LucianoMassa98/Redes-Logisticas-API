import path from 'path';
import { fileURLToPath } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
import { sequelize, testConnection } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMigrator = (seq = sequelize) => {
  if (!seq) {
    throw new Error('No hay conexión de base de datos activa configurada.');
  }

  const migrationsPath = path.join(__dirname, 'migrations', '*.js').replace(/\\/g, '/');

  return new Umzug({
    migrations: {
      glob: migrationsPath,
      resolve: ({ name, path: filepath }) => {
        return {
          name,
          up: async (params) => {
            const migration = await import(`file://${filepath}`);
            return migration.up({ ...params, Sequelize });
          },
          down: async (params) => {
            const migration = await import(`file://${filepath}`);
            return migration.down({ ...params, Sequelize });
          },
        };
      },
    },
    context: seq.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize: seq, tableName: 'sequelize_meta' }),
    logger: console,
  });
};

const runCli = async () => {
  const action = process.argv[2] || 'up';

  console.log(`[MIGRACIONES] Ejecutando acción: ${action}`);
  const conn = await testConnection();
  if (!conn.ok) {
    console.error(`[MIGRACIONES ERROR] No se puede conectar a la base de datos: ${conn.message}`);
    process.exit(1);
  }

  const migrator = getMigrator(sequelize);

  try {
    if (action === 'up') {
      const executed = await migrator.up();
      if (executed.length === 0) {
        console.log('[MIGRACIONES] La base de datos ya está al día. No hay migraciones pendientes.');
      } else {
        console.log(`[MIGRACIONES] ${executed.length} migraciones ejecutadas con éxito:`);
        executed.forEach((m) => console.log(`  ✓ ${m.name}`));
      }
    } else if (action === 'down') {
      const reverted = await migrator.down();
      if (reverted.length === 0) {
        console.log('[MIGRACIONES] No hay migraciones para revertir.');
      } else {
        console.log(`[MIGRACIONES] ${reverted.length} migración revertida:`);
        reverted.forEach((m) => console.log(`  ↺ ${m.name}`));
      }
    } else if (action === 'status') {
      const pending = await migrator.pending();
      const executed = await migrator.executed();

      console.log('\n--- ESTADO DE MIGRACIONES ---');
      console.log(`Ejecutadas (${executed.length}):`);
      executed.forEach((m) => console.log(`  ✓ ${m.name}`));

      console.log(`\nPendientes (${pending.length}):`);
      pending.forEach((m) => console.log(`  ⏳ ${m.name}`));
      console.log('------------------------------\n');
    } else {
      console.error(`Acción desconocida: ${action}. Usa "up", "down" o "status".`);
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error('[MIGRACIONES ERROR] Fallo durante la ejecución:', err);
    process.exit(1);
  }
};

// Si se ejecuta directamente desde línea de comandos
if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runCli();
}
