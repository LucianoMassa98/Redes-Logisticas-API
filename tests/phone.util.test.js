import { describe, it } from 'node:test';
import assert from 'node:assert';
import { normalizePhoneNumber, getWhatsAppLink, getTelLink } from '../src/utils/phone.util.js';

describe('Pruebas de Utilidad Telefónica (Argentina e Internacional)', () => {
  it('debe normalizar número local argentino de 10 dígitos anteponiendo +549', () => {
    const raw = '11 4455-6677';
    const normalized = normalizePhoneNumber(raw);
    assert.strictEqual(normalized, '+5491144556677');
  });

  it('debe normalizar número argentino con prefijo 0', () => {
    const raw = '011 4455 6677';
    const normalized = normalizePhoneNumber(raw);
    assert.strictEqual(normalized, '+5491144556677');
  });

  it('debe normalizar número que ya tiene 54 pero le falta el 9 móvil', () => {
    const raw = '54 11 4455 6677';
    const normalized = normalizePhoneNumber(raw);
    assert.strictEqual(normalized, '+5491144556677');
  });

  it('debe respetar números con formato internacional completo', () => {
    const raw = '+1 (555) 123-4567';
    const normalized = normalizePhoneNumber(raw);
    assert.strictEqual(normalized, '+15551234567');
  });

  it('debe generar enlace de WhatsApp sin caracteres especiales', () => {
    const link = getWhatsAppLink('+54 9 11 4455-6677');
    assert.strictEqual(link, 'https://wa.me/5491144556677');
  });

  it('debe generar enlace tel:', () => {
    const link = getTelLink('+5491144556677');
    assert.strictEqual(link, 'tel:+5491144556677');
  });
});
