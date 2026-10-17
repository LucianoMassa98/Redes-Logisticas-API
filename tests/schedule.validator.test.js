import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createScheduleSchema,
  updateScheduleSchema,
  updateScheduleStatusSchema,
} from '../src/validators/schedule.validator.js';
import { INSTALLATION_STATUSES } from '../src/utils/constants.js';

test('Pruebas de Validadores de Instalaciones Programadas', async (t) => {
  await t.test('createScheduleSchema', async (st) => {
    await st.test('debe validar exitosamente una instalación con todos sus campos obligatorios', () => {
      const validPayload = {
        title: 'Instalación Starlink Rural',
        clientName: 'Juan Pérez',
        clientPhone: '+5493411234567',
        clientAddress: 'Ruta 9 Km 280',
        locality: 'Funes',
        serviceType: 'STARLINK',
        scheduledDate: '2026-10-25',
        startTime: '10:00',
        durationMinutes: 180,
        technicianName: 'Marcos Rodríguez',
        status: INSTALLATION_STATUSES.CONFIRMED,
        priority: 'HIGH',
        estimatedPrice: 150000,
      };

      const { error, value } = createScheduleSchema.validate(validPayload);
      assert.equal(error, undefined);
      assert.equal(value.clientName, 'Juan Pérez');
      assert.equal(value.scheduledDate, '2026-10-25');
      assert.equal(value.startTime, '10:00');
    });

    await st.test('debe fallar si la fecha no tiene formato YYYY-MM-DD', () => {
      const invalidPayload = {
        title: 'Instalación CCTV',
        clientName: 'Ana López',
        clientPhone: '+5493419876543',
        clientAddress: 'San Martín 1234',
        scheduledDate: '25-10-2026', // Formato incorrecto
      };

      const { error } = createScheduleSchema.validate(invalidPayload);
      assert.notEqual(error, undefined);
      assert.match(error.message, /YYYY-MM-DD/);
    });

    await st.test('debe fallar si falta el nombre o el teléfono', () => {
      const incompletePayload = {
        title: 'Instalación Cámaras',
        clientAddress: 'Mitre 500',
        scheduledDate: '2026-10-25',
      };

      const { error } = createScheduleSchema.validate(incompletePayload);
      assert.notEqual(error, undefined);
    });
  });

  await t.test('updateScheduleStatusSchema', async (st) => {
    await st.test('debe aceptar estados válidos de instalación', () => {
      const { error } = updateScheduleStatusSchema.validate({
        status: INSTALLATION_STATUSES.COMPLETED,
        notes: 'Finalizado sin problemas.',
      });
      assert.equal(error, undefined);
    });

    await st.test('debe rechazar estados inexistentes', () => {
      const { error } = updateScheduleStatusSchema.validate({
        status: 'ESTADO_INVENTADO',
      });
      assert.notEqual(error, undefined);
    });
  });
});
