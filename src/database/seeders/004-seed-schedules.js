import { v4 as uuidv4 } from 'uuid';

export const up = async ({ context: queryInterface }) => {
  // Consultar leads y plantillas existentes para asociar
  const [leads] = await queryInterface.sequelize.query(
    'SELECT id, full_name, phone, email, address, locality FROM leads ORDER BY created_at DESC LIMIT 5'
  );

  const [presets] = await queryInterface.sequelize.query(
    'SELECT id, code, name FROM installation_presets'
  );

  const presetMap = new Map(presets.map((p) => [p.code, p.id]));
  const lead1 = leads[0] || null;
  const lead2 = leads[1] || null;
  const lead3 = leads[2] || null;

  const now = new Date();
  const formatDateOffset = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const schedules = [
    {
      id: uuidv4(),
      lead_id: lead1 ? lead1.id : null,
      preset_id: presetMap.get('PRESET_STARLINK_STD') || null,
      assigned_user_id: null,
      title: 'Instalación Starlink Satelital - Estancia Los Ombúes',
      client_name: lead1 ? lead1.full_name : 'Carlos Mendizábal',
      client_phone: lead1 ? lead1.phone : '+5493415551234',
      client_email: lead1 ? lead1.email : 'carlos.m@agrolosombues.com',
      client_address: lead1 ? lead1.address : 'Ruta Provincial 18 Km 24',
      locality: lead1 ? lead1.locality : 'Zavalla',
      service_type: 'STARLINK',
      scheduled_date: formatDateOffset(0), // Hoy
      start_time: '10:00',
      end_time: '13:00',
      duration_minutes: 180,
      technician_name: 'Marcos Rodríguez',
      status: 'CONFIRMED',
      priority: 'HIGH',
      estimated_price: 185000,
      materials: JSON.stringify([
        { code: 'STA-MNT-WALL', name: 'Soporte articulado de pared Starlink', quantity: 1 },
        { code: 'CBL-UTP-CAT6', name: 'Bobina Cable UTP Cat6 Exterior', quantity: 30 },
      ]),
      notes: 'Llevar escalera telescópica de 6m y adaptador de caño. Acceso por tranquera principal.',
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      lead_id: lead2 ? lead2.id : null,
      preset_id: presetMap.get('PRESET_CCTV_2CAM') || null,
      assigned_user_id: null,
      title: 'Instalación Kit CCTV 4 Cámaras - Supermercado San Cayetano',
      client_name: lead2 ? lead2.full_name : 'Valeria Gómez',
      client_phone: lead2 ? lead2.phone : '+5493416889900',
      client_email: lead2 ? lead2.email : 'valeriagomez@sancayetano.com',
      client_address: lead2 ? lead2.address : 'Av. Pellegrini 3450',
      locality: lead2 ? lead2.locality : 'Rosario',
      service_type: 'CAMARAS_CABLEADAS',
      scheduled_date: formatDateOffset(1), // Mañana
      start_time: '09:00',
      end_time: '13:30',
      duration_minutes: 270,
      technician_name: 'Lucas Benítez',
      status: 'CONFIRMED',
      priority: 'NORMAL',
      estimated_price: 340000,
      materials: JSON.stringify([
        { code: 'CAM-IP-1080', name: 'Cámara IP 1080p Exterior', quantity: 4 },
        { code: 'DVR-4CH-1080', name: 'DVR 4 Canales HD', quantity: 1 },
        { code: 'HDD-1TB-PURPLE', name: 'Disco Rígido 1TB WD Purple', quantity: 1 },
      ]),
      notes: 'Instalación de cámaras en línea de cajas y depósito. Dejar configurada app en el celular del dueño.',
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      lead_id: lead3 ? lead3.id : null,
      preset_id: presetMap.get('PRESET_SOLAR_RURAL') || null,
      assigned_user_id: null,
      title: 'Montaje Cámara Solar 4G - Galpón y Silos',
      client_name: lead3 ? lead3.full_name : 'Esteban Rossi',
      client_phone: lead3 ? lead3.phone : '+5493414112233',
      client_email: lead3 ? lead3.email : 'esteban.rossi@campoabierto.com.ar',
      client_address: lead3 ? lead3.address : 'Camino Rural Los Pinos s/n',
      locality: lead3 ? lead3.locality : 'Roldán',
      service_type: 'CAMARAS_SOLARES',
      scheduled_date: formatDateOffset(3), // En 3 días
      start_time: '14:30',
      end_time: '16:30',
      duration_minutes: 120,
      technician_name: 'Marcos Rodríguez',
      status: 'PENDING',
      priority: 'NORMAL',
      estimated_price: 210000,
      materials: JSON.stringify([
        { code: 'CAM-SOL-4G', name: 'Cámara Solar 4G con Panel y Batería', quantity: 1 },
      ]),
      notes: 'Punto sin energía de red. Orientar panel solar hacia el norte geográfico a 45 grados.',
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      lead_id: null,
      preset_id: presetMap.get('PRESET_WIFI_MESH') || null,
      assigned_user_id: null,
      title: 'Red Mesh Wi-Fi 6 y Cableado - Hotel Boutique Del Centro',
      client_name: 'Martín Lanús',
      client_phone: '+5493415998877',
      client_email: 'gerencia@hotelboutique.com',
      client_address: 'Bv. Oroño 820',
      locality: 'Rosario',
      service_type: 'REDES_CONECTIVIDAD',
      scheduled_date: formatDateOffset(-2), // Hace 2 días (Completada)
      start_time: '08:30',
      end_time: '12:00',
      duration_minutes: 210,
      technician_name: 'Lucas Benítez',
      status: 'COMPLETED',
      priority: 'HIGH',
      estimated_price: 280000,
      materials: JSON.stringify([
        { code: 'WIFI-MESH-AP', name: 'Punto de Acceso Wi-Fi 6 Doble Banda', quantity: 2 },
        { code: 'SWT-8P-GIGA', name: 'Switch 8 Puertos Gigabit', quantity: 1 },
      ]),
      notes: 'Instalación finalizada con éxito. Cobertura del 100% en ambos pisos. Cliente muy conforme.',
      completed_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      lead_id: null,
      preset_id: null,
      assigned_user_id: null,
      title: 'Configuración Streaming TV y Red - Dpto 4to Piso',
      client_name: 'Florencia Herrera',
      client_phone: '+5493417774411',
      client_email: 'flor.herrera@gmail.com',
      client_address: 'Córdoba 1820 4° B',
      locality: 'Rosario',
      service_type: 'TV_STREAMING',
      scheduled_date: formatDateOffset(5), // En 5 días
      start_time: '16:00',
      end_time: '17:30',
      duration_minutes: 90,
      technician_name: 'Técnico a Designar',
      status: 'CONFIRMED',
      priority: 'LOW',
      estimated_price: 45000,
      materials: JSON.stringify([]),
      notes: 'Configuración de 2 Smart TVs y enlace a router principal con cable UTP canalizado.',
      completed_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await queryInterface.bulkInsert('installation_schedules', schedules);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('installation_schedules', null, {});
};
