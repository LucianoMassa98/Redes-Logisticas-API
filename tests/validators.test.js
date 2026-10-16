import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createLeadSchema, updateLeadStatusSchema } from '../src/validators/lead.validator.js';
import { loginSchema } from '../src/validators/auth.validator.js';
import { CUSTOMER_TYPES, LEAD_STATUSES } from '../src/utils/constants.js';

describe('Pruebas de Validadores Joi', () => {
  describe('createLeadSchema', () => {
    it('debe validar exitosamente un lead con todos los campos obligatorios correctos', () => {
      const validLead = {
        fullName: 'Juan Pérez',
        phone: '+5491144556677',
        address: 'Av. Siempreviva 742',
        locality: 'Springfield',
        customerType: CUSTOMER_TYPES.HOGAR,
        services: ['CAMARAS_CABLEADAS', 'STARLINK'],
        privacyAccepted: true,
      };

      const { error, value } = createLeadSchema.validate(validLead);
      assert.strictEqual(error, undefined);
      assert.strictEqual(value.fullName, 'Juan Pérez');
    });

    it('debe fallar si falta el nombre o es demasiado corto', () => {
      const invalidLead = {
        fullName: 'Ju',
        phone: '+5491144556677',
        address: 'Av. Siempreviva 742',
        locality: 'Springfield',
        customerType: CUSTOMER_TYPES.HOGAR,
        services: ['CAMARAS_CABLEADAS'],
        privacyAccepted: true,
      };

      const { error } = createLeadSchema.validate(invalidLead);
      assert.ok(error);
      assert.ok(error.details.some((d) => d.path.includes('fullName')));
    });

    it('debe fallar si no se seleccionó al menos un servicio', () => {
      const invalidLead = {
        fullName: 'Juan Pérez',
        phone: '+5491144556677',
        address: 'Av. Siempreviva 742',
        locality: 'Springfield',
        customerType: CUSTOMER_TYPES.HOGAR,
        services: [],
        privacyAccepted: true,
      };

      const { error } = createLeadSchema.validate(invalidLead);
      assert.ok(error);
      assert.ok(error.details.some((d) => d.path.includes('services')));
    });

    it('debe fallar si privacyAccepted es false o no se envía', () => {
      const invalidLead = {
        fullName: 'Juan Pérez',
        phone: '+5491144556677',
        address: 'Av. Siempreviva 742',
        locality: 'Springfield',
        customerType: CUSTOMER_TYPES.HOGAR,
        services: ['CAMARAS_CABLEADAS'],
        privacyAccepted: false,
      };

      const { error } = createLeadSchema.validate(invalidLead);
      assert.ok(error);
      assert.ok(error.details.some((d) => d.path.includes('privacyAccepted')));
    });

    it('debe rechazar campos adicionales no permitidos (prevención de autoasignación)', () => {
      const maliciousLead = {
        fullName: 'Juan Pérez',
        phone: '+5491144556677',
        address: 'Av. Siempreviva 742',
        locality: 'Springfield',
        customerType: CUSTOMER_TYPES.HOGAR,
        services: ['CAMARAS_CABLEADAS'],
        privacyAccepted: true,
        status: 'WON', // Intento de inyectar estado ganado
        role: 'ADMIN', // Intento de inyectar rol
      };

      const { error } = createLeadSchema.validate(maliciousLead);
      assert.ok(error);
      assert.ok(error.details.some((d) => d.message.includes('not allowed')));
    });
  });

  describe('updateLeadStatusSchema', () => {
    it('debe aceptar estados comerciales válidos', () => {
      const { error } = updateLeadStatusSchema.validate({
        status: LEAD_STATUSES.QUALIFIED,
        note: 'Cliente interesado en 4 cámaras domo',
      });
      assert.strictEqual(error, undefined);
    });

    it('debe rechazar estados comerciales inexistentes', () => {
      const { error } = updateLeadStatusSchema.validate({
        status: 'ESTADO_INVALIDO',
      });
      assert.ok(error);
    });
  });

  describe('loginSchema', () => {
    it('debe validar credenciales con formato correcto', () => {
      const { error } = loginSchema.validate({
        email: 'admin@empresa.com',
        password: 'PasswordSegura123',
      });
      assert.strictEqual(error, undefined);
    });

    it('debe rechazar emails inválidos', () => {
      const { error } = loginSchema.validate({
        email: 'no-es-un-email',
        password: 'PasswordSegura123',
      });
      assert.ok(error);
    });
  });
});
