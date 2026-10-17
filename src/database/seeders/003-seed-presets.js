export const up = async ({ context: queryInterface }) => {
  // Consultar los artículos de inventario existentes para mapear sus IDs
  const [inventoryItems] = await queryInterface.sequelize.query(
    'SELECT id, code, name FROM inventory_items'
  );

  const itemMap = new Map(inventoryItems.map((i) => [i.code, i.id]));

  const presets = [
    {
      code: 'PRESET_CCTV_2CAM',
      name: 'Kit CCTV 2 Cámaras + DVR + Disco 1TB',
      category: 'CÁMARAS',
      icon: 'Camera',
      description: 'Instalación completa de 2 cámaras exteriores Full HD, DVR de 4 canales, disco Western Digital Purple 1TB y 50m de cable UTP exterior.',
      labor_cost: 45000,
      markup_percent: null,
      items: JSON.stringify([
        { id: itemMap.get('CAM-IP-1080'), code: 'CAM-IP-1080', quantity: 2 },
        { id: itemMap.get('DVR-4CH-1080'), code: 'DVR-4CH-1080', quantity: 1 },
        { id: itemMap.get('HDD-1TB-PURPLE'), code: 'HDD-1TB-PURPLE', quantity: 1 },
        { id: itemMap.get('CBL-UTP-CAT6'), code: 'CBL-UTP-CAT6', quantity: 50 },
        { id: itemMap.get('BALUN-HD-PAIR'), code: 'BALUN-HD-PAIR', quantity: 2 },
      ].filter((i) => i.id)),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      code: 'PRESET_STARLINK_STD',
      name: 'Montaje e Instalación Starlink Satelital',
      category: 'STARLINK',
      icon: 'Satellite',
      description: 'Montaje profesional en pared o alero con soporte articulado de acero galvanizado, 30m cableado exterior prolijo y puesta en marcha.',
      labor_cost: 40000,
      markup_percent: null,
      items: JSON.stringify([
        { id: itemMap.get('STA-MNT-WALL'), code: 'STA-MNT-WALL', quantity: 1 },
        { id: itemMap.get('CBL-UTP-CAT6'), code: 'CBL-UTP-CAT6', quantity: 30 },
        { id: itemMap.get('CON-RJ45-CAT6'), code: 'CON-RJ45-CAT6', quantity: 4 },
        { id: itemMap.get('WIFI-MESH-AP'), code: 'WIFI-MESH-AP', quantity: 1 },
      ].filter((i) => i.id)),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      code: 'PRESET_SOLAR_RURAL',
      name: 'Cámara Solar Rural 4G Autónoma',
      category: 'ENERGIA_SOLAR',
      icon: 'Sun',
      description: 'Instalación autónoma de cámara con panel solar y batería de litio para tranqueras, campos o predios sin conexión eléctrica.',
      labor_cost: 28000,
      markup_percent: null,
      items: JSON.stringify([
        { id: itemMap.get('CAM-SOL-4G'), code: 'CAM-SOL-4G', quantity: 1 },
      ].filter((i) => i.id)),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      code: 'PRESET_WIFI_EXT',
      name: 'Extensión Wi-Fi 6 Mesh + Switch Gigabit',
      category: 'REDES',
      icon: 'Network',
      description: 'Ampliación de red para cubrir galpones, quinchos o patios con Access Point Wi-Fi 6 y Switch de 8 bocas cableadas.',
      labor_cost: 35000,
      markup_percent: null,
      items: JSON.stringify([
        { id: itemMap.get('WIFI-MESH-AP'), code: 'WIFI-MESH-AP', quantity: 1 },
        { id: itemMap.get('SW-8P-GIGA'), code: 'SW-8P-GIGA', quantity: 1 },
        { id: itemMap.get('CBL-UTP-CAT6'), code: 'CBL-UTP-CAT6', quantity: 40 },
        { id: itemMap.get('CON-RJ45-CAT6'), code: 'CON-RJ45-CAT6', quantity: 6 },
      ].filter((i) => i.id)),
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  for (const preset of presets) {
    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM installation_presets WHERE code = '${preset.code}'`
    );

    if (existing.length === 0) {
      await queryInterface.bulkInsert('installation_presets', [
        {
          id: queryInterface.sequelize.literal('gen_random_uuid()'),
          ...preset,
        },
      ]);
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('installation_presets', null, {});
};
