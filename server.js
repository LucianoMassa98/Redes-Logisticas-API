import app from './src/app.js';
import { config } from './src/config/env.js';
import { connectDatabase, closeDatabase } from './src/database/connection.js';

const startServer = async () => {
  console.log('='.repeat(55));
  console.log(' PLATAFORMA DE SERVICIOS TECNOLÓGICOS - BACKEND API');
  console.log('='.repeat(55));
  console.log(`[ENTORNO] Modo: ${config.env}`);
  console.log(`[CORS] Orígenes permitidos: ${config.corsOrigins.join(', ')}`);

  // Intentar conectar a PostgreSQL
  const dbConnected = await connectDatabase();
  if (!dbConnected) {
    console.warn('[AVISO] El servidor se iniciará, pero las operaciones que requieran persistencia fallarán hasta que se configure una DATABASE_URL válida.');
  }

  const server = app.listen(config.port, () => {
    console.log(`[API] Servidor HTTP escuchando en http://localhost:${config.port}`);
    console.log(`[API] Documentación Swagger disponible en http://localhost:${config.port}/api/docs`);
    console.log(`[API] Health check disponible en http://localhost:${config.port}/api/v1/health`);
    console.log('='.repeat(55));
  });

  // Manejo de apagado elegante (Graceful Shutdown)
  const shutdown = async (signal) => {
    console.log(`\n[SHUTDOWN] Señal ${signal} recibida. Cerrando servidor de forma ordenada...`);
    server.close(async () => {
      console.log('[SHUTDOWN] Servidor HTTP detenido.');
      await closeDatabase();
      process.exit(0);
    });

    // Forzar cierre si no responde en 10 segundos
    setTimeout(() => {
      console.error('[SHUTDOWN ERROR] Forzando salida tras timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('[FATAL ERROR] Fallo crítico al iniciar el servidor:', err);
  process.exit(1);
});
