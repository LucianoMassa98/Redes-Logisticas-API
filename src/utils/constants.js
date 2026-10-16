/**
 * Constantes y enums del sistema comercial y de seguridad
 */

export const SERVICE_CODES = {
  CAMARAS_CABLEADAS: 'CAMARAS_CABLEADAS',
  CAMARAS_SOLARES: 'CAMARAS_SOLARES',
  STARLINK: 'STARLINK',
  TV_STREAMING: 'TV_STREAMING',
  REDES_CONECTIVIDAD: 'REDES_CONECTIVIDAD',
};

export const INITIAL_SERVICES = [
  {
    code: SERVICE_CODES.CAMARAS_CABLEADAS,
    name: 'Cámaras de seguridad cableadas',
    description: 'Instalación de cámaras interiores y exteriores, cableado estructurado, sistemas DVR/NVR y acceso remoto seguro en alta definición.',
    isActive: true,
  },
  {
    code: SERVICE_CODES.CAMARAS_SOLARES,
    name: 'Cámaras con paneles solares',
    description: 'Sistemas de videovigilancia autónomos con paneles solares y baterías de litio, ideales para fincas, galpones y accesos sin red eléctrica.',
    isActive: true,
  },
  {
    code: SERVICE_CODES.STARLINK,
    name: 'Internet satelital Starlink',
    description: 'Instalación profesional de antenas en altura, anclajes resistentes, ruteo de cables y configuración de red local de alta velocidad.',
    isActive: true,
  },
  {
    code: SERVICE_CODES.TV_STREAMING,
    name: 'Televisión y streaming',
    description: 'Configuración integral de Smart TVs, dispositivos de streaming certificados, optimización de apps y enlace con redes hogareñas o corporativas.',
    isActive: true,
  },
  {
    code: SERVICE_CODES.REDES_CONECTIVIDAD,
    name: 'Redes y conectividad',
    description: 'Cableado Ethernet UTP/FTP, configuración de routers avanzados, repetidores y puntos de acceso Wi-Fi de alta cobertura y estabilidad.',
    isActive: true,
  },
];

export const LEAD_STATUSES = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  VISIT_SCHEDULED: 'VISIT_SCHEDULED',
  QUOTE_SENT: 'QUOTE_SENT',
  WON: 'WON',
  LOST: 'LOST',
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  COMMERCIAL: 'COMMERCIAL',
};

export const CUSTOMER_TYPES = {
  HOGAR: 'HOGAR',
  LOCAL_COMERCIAL: 'LOCAL_COMERCIAL',
  OFICINA: 'OFICINA',
  HOTEL_ALOJAMIENTO: 'HOTEL_ALOJAMIENTO',
  EMPRESA_RURAL: 'EMPRESA_RURAL',
  OTRO: 'OTRO',
};

export const PREFERRED_CONTACT_METHODS = {
  WHATSAPP: 'WHATSAPP',
  LLAMADA: 'LLAMADA',
  EMAIL: 'EMAIL',
};

export const QUOTE_STATUSES = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
};

export const ACTIVITY_TYPES = {
  LEAD_CREATED: 'LEAD_CREATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  ASSIGNMENT_CHANGED: 'ASSIGNMENT_CHANGED',
  NOTE_ADDED: 'NOTE_ADDED',
  CONTACT_MADE: 'CONTACT_MADE',
  VISIT_SCHEDULED: 'VISIT_SCHEDULED',
  QUOTE_CREATED: 'QUOTE_CREATED',
  QUOTE_SENT: 'QUOTE_SENT',
  LEAD_WON: 'LEAD_WON',
  LEAD_LOST: 'LEAD_LOST',
  DATA_UPDATED: 'DATA_UPDATED',
};
