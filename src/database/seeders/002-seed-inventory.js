const INITIAL_INVENTORY = [
  {
    code: 'CAM-IP-1080',
    name: 'Cámara Bullet IP 2MP Visión Nocturna IR 30m',
    category: 'CAMARAS',
    costPrice: 28000.0,
    stockQuantity: 16,
    minStockAlert: 4,
    unit: 'UNIDAD',
    description: 'Cámara tubular impermeable IP67 para exteriores, lente de 2.8mm y visión nocturna.',
  },
  {
    code: 'CAM-DOMO-2MP',
    name: 'Cámara Domo Antivandálica 2MP Interior/Exterior',
    category: 'CAMARAS',
    costPrice: 29500.0,
    stockQuantity: 12,
    minStockAlert: 4,
    unit: 'UNIDAD',
    description: 'Domo metálico IK10 para techos y galerías.',
  },
  {
    code: 'CAM-SOL-4G',
    name: 'Cámara Solar 4G Autónoma con Batería y Panel Fotovoltaico',
    category: 'ENERGIA_SOLAR',
    costPrice: 85000.0,
    stockQuantity: 8,
    minStockAlert: 2,
    unit: 'UNIDAD',
    description: 'Cámara 100% autónoma para campos y tranqueras con ranura MicroSIM 4G.',
  },
  {
    code: 'DVR-4CH-1080',
    name: 'Grabador Digital DVR 4 Canales Full HD',
    category: 'DVR_NVR',
    costPrice: 52000.0,
    stockQuantity: 5,
    minStockAlert: 2,
    unit: 'UNIDAD',
    description: 'Grabador de 4 canales analógicos HD con compresión H.265+ y acceso remoto móvil.',
  },
  {
    code: 'NVR-8CH-POE',
    name: 'Grabador de Red NVR 8 Canales 4K con Switch PoE',
    category: 'DVR_NVR',
    costPrice: 110000.0,
    stockQuantity: 4,
    minStockAlert: 2,
    unit: 'UNIDAD',
    description: 'NVR con 8 puertos PoE integrados para alimentación directa por cable de red.',
  },
  {
    code: 'HDD-1TB-PURPLE',
    name: 'Disco Rígido 1TB Western Digital Purple CCTV 24/7',
    category: 'DVR_NVR',
    costPrice: 65000.0,
    stockQuantity: 10,
    minStockAlert: 3,
    unit: 'UNIDAD',
    description: 'Disco rígido especializado de alta durabilidad para grabación continua sin pérdidas.',
  },
  {
    code: 'CBL-UTP-CAT6',
    name: 'Cable de Red UTP Cat6 100% Cobre Doble Vaina Exterior',
    category: 'CABLEADO',
    costPrice: 650.0,
    stockQuantity: 500,
    minStockAlert: 100,
    unit: 'METRO',
    description: 'Cable estructurado resistente a rayos UV e intemperie.',
  },
  {
    code: 'CON-RJ45-CAT6',
    name: 'Ficha Conector RJ45 Cat6 Blindado con Guía',
    category: 'CABLEADO',
    costPrice: 350.0,
    stockQuantity: 200,
    minStockAlert: 50,
    unit: 'UNIDAD',
    description: 'Conectores modulares de alta velocidad con contactos dorados.',
  },
  {
    code: 'STA-MNT-WALL',
    name: 'Soporte Articulado de Acero Galvanizado para Starlink',
    category: 'STARLINK_ACCESORIOS',
    costPrice: 32000.0,
    stockQuantity: 6,
    minStockAlert: 2,
    unit: 'UNIDAD',
    description: 'Soporte reforzado para amurar en aleros, techos inclinados o paredes con tornillos tirafondo.',
  },
  {
    code: 'STA-PIPE-ADP',
    name: 'Adaptador de Caño / Mástil para Antena Starlink',
    category: 'STARLINK_ACCESORIOS',
    costPrice: 18000.0,
    stockQuantity: 8,
    minStockAlert: 2,
    unit: 'UNIDAD',
    description: 'Abrazadera mecanizada de alta rigidez para fijación a mástiles de hasta 2 pulgadas.',
  },
  {
    code: 'WIFI-MESH-AP',
    name: 'Punto de Acceso Wi-Fi 6 Gigabit Mesh Doble Banda',
    category: 'CONECTIVIDAD_REDES',
    costPrice: 48000.0,
    stockQuantity: 7,
    minStockAlert: 2,
    unit: 'UNIDAD',
    description: 'Access point de largo alcance para cobertura en interiores y exteriores semicubiertos.',
  },
  {
    code: 'SW-8P-GIGA',
    name: 'Switch Gigabit Ethernet 8 Puertos 10/100/1000',
    category: 'CONECTIVIDAD_REDES',
    costPrice: 28000.0,
    stockQuantity: 6,
    minStockAlert: 2,
    unit: 'UNIDAD',
    description: 'Switch metálico no administrable para distribución de red.',
  },
  {
    code: 'MO-INSTALACION',
    name: 'Mano de Obra Técnica Especializada y Montaje',
    category: 'MANO_DE_OBRA',
    costPrice: 15000.0,
    stockQuantity: 999,
    minStockAlert: 10,
    unit: 'HORA',
    description: 'Hora de trabajo técnico en altura, canalización, configuración y calibración.',
  },
];

export const up = async ({ context: queryInterface, Sequelize }) => {
  for (const item of INITIAL_INVENTORY) {
    const existing = await queryInterface.rawSelect(
      'inventory_items',
      {
        where: { code: item.code },
      },
      ['id']
    );

    if (!existing) {
      await queryInterface.bulkInsert('inventory_items', [
        {
          id: Sequelize.fn('gen_random_uuid'),
          code: item.code,
          name: item.name,
          category: item.category,
          cost_price: item.costPrice,
          stock_quantity: item.stockQuantity,
          min_stock_alert: item.minStockAlert,
          unit: item.unit,
          markup_percent: null, // usa el % de ganancia por defecto del .env
          description: item.description,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  const codes = INITIAL_INVENTORY.map((i) => i.code);
  await queryInterface.bulkDelete('inventory_items', {
    code: codes,
  });
};
