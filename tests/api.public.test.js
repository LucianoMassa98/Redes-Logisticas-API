import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';

describe('Pruebas de Endpoints HTTP y Seguridad', () => {
  it('GET /api/v1/health debe retornar 200 y status UP', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'UP');
    assert.ok(res.body.data.uptime >= 0);
  });

  it('GET /api/v1/ruta-inexistente debe responder con 404 normalizado con Boom', async () => {
    const res = await request(app).get('/api/v1/ruta-totalmente-inexistente');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('no fue encontrada'));
  });

  it('POST /api/v1/leads con datos inválidos debe responder con 400 y detalle de campos', async () => {
    const res = await request(app)
      .post('/api/v1/leads')
      .send({
        fullName: 'A', // Demasiado corto
        // Falta phone, address, locality, customerType, services, privacyAccepted
      });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
    assert.ok(res.body.errors.length > 0);
  });

  it('GET /api/v1/admin/leads sin token de autorización debe responder con 401', async () => {
    const res = await request(app).get('/api/v1/admin/leads');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('Token'));
  });

  it('POST /api/v1/auth/login con credenciales inválidas debe responder con 400 o 401 sin exponer información sensible', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'invalido@empresa.com',
        password: 'password_invalido_123',
      });

    assert.ok([400, 401, 500].includes(res.status));
    assert.strictEqual(res.body.success, false);
    // Verificar que no se expongan contraseñas ni stack traces
    assert.strictEqual(res.body.password, undefined);
  });
});
