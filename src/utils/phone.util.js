/**
 * Utilidad para validación y normalización de números de teléfono
 * Soporta números de Argentina (prefijos 54, 9, 11, etc.) e internacionales (+).
 */

export const normalizePhoneNumber = (rawPhone) => {
  if (!rawPhone || typeof rawPhone !== 'string') return '';

  // Quitar espacios, guiones, paréntesis y puntos
  let cleaned = rawPhone.replace(/[\s\-\(\)\.]/g, '');

  // Si tiene signo +, conservarlo al inicio temporalmente
  const hasPlus = cleaned.startsWith('+');
  cleaned = cleaned.replace(/\D/g, '');

  // Normalización específica para Argentina
  // Ej: Si empieza con 0, quitar el 0
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  // Si el usuario ingresó un número argentino sin código de país (10 dígitos e.g. 11 1234 5678 o 351 123 4567)
  if (cleaned.length === 10 && !cleaned.startsWith('54')) {
    cleaned = '549' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('9')) {
    // Ingresó 9 seguido de 10 dígitos (ej 9 11 1234 5678)
    cleaned = '54' + cleaned;
  } else if (cleaned.startsWith('54') && !cleaned.startsWith('549') && cleaned.length === 12) {
    // Ingresó 54 seguido de código de área sin el 9 móvil (ej: 54 11 1234 5678) -> agregar el 9 móvil
    cleaned = '549' + cleaned.slice(2);
  }

  return '+' + cleaned;
};

export const getWhatsAppLink = (normalizedPhone) => {
  if (!normalizedPhone) return null;
  const digits = normalizedPhone.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
};

export const getTelLink = (normalizedPhone) => {
  if (!normalizedPhone) return null;
  return `tel:${normalizedPhone}`;
};
