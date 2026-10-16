/**
 * Utilidad para exportación de leads a formato CSV seguro
 */

export const leadsToCsv = (leads) => {
  const headers = [
    'ID',
    'Fecha de Ingreso',
    'Nombre y Apellido',
    'Teléfono',
    'Email',
    'Localidad',
    'Dirección',
    'Tipo de Cliente',
    'Servicios de Interés',
    'Estado Comercial',
    'Medio de Contacto Preferido',
    'Responsable Asignado',
    'Último Contacto',
    'Descripción / Necesidad',
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = leads.map((lead) => {
    const servicesList = lead.services ? lead.services.map((s) => s.name).join(', ') : '';
    const assignedName = lead.assignedUser ? lead.assignedUser.fullName : 'Sin asignar';

    return [
      escapeCsv(lead.id),
      escapeCsv(lead.createdAt ? new Date(lead.createdAt).toISOString() : ''),
      escapeCsv(lead.fullName),
      escapeCsv(lead.phone),
      escapeCsv(lead.email || ''),
      escapeCsv(lead.locality),
      escapeCsv(lead.address),
      escapeCsv(lead.customerType),
      escapeCsv(servicesList),
      escapeCsv(lead.status),
      escapeCsv(lead.preferredContactMethod),
      escapeCsv(assignedName),
      escapeCsv(lead.lastContactAt ? new Date(lead.lastContactAt).toISOString() : ''),
      escapeCsv(lead.description || ''),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
};
