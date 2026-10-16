import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/utils/jwt.util.js';

describe('Pruebas de Utilidad JWT y Seguridad', () => {
  const mockUser = {
    id: 'b7a5a8f5-673e-4d43-8515-58276f5b9911',
    email: 'admin@empresa.com',
    fullName: 'Administrador Principal',
    role: 'ADMIN',
  };

  it('debe generar y verificar un access token válido con los claims correspondientes', () => {
    const token = generateAccessToken(mockUser);
    assert.ok(typeof token === 'string');

    const decoded = verifyAccessToken(token);
    assert.ok(decoded);
    assert.strictEqual(decoded.id, mockUser.id);
    assert.strictEqual(decoded.email, mockUser.email);
    assert.strictEqual(decoded.role, mockUser.role);
  });

  it('debe generar y verificar un refresh token válido', () => {
    const token = generateRefreshToken(mockUser);
    assert.ok(typeof token === 'string');

    const decoded = verifyRefreshToken(token);
    assert.ok(decoded);
    assert.strictEqual(decoded.id, mockUser.id);
  });

  it('debe retornar null al verificar un token adulterado o inválido', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token_falso.invalido';
    const decoded = verifyAccessToken(invalidToken);
    assert.strictEqual(decoded, null);
  });
});
