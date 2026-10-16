export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('leads', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    full_name: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(150),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    locality: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    province: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: 'Argentina',
    },
    customer_type: {
      type: Sequelize.ENUM('HOGAR', 'LOCAL_COMERCIAL', 'OFICINA', 'HOTEL_ALOJAMIENTO', 'EMPRESA_RURAL', 'OTRO'),
      allowNull: false,
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    },
    location_reference: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    preferred_contact_method: {
      type: Sequelize.ENUM('WHATSAPP', 'LLAMADA', 'EMAIL'),
      defaultValue: 'WHATSAPP',
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'VISIT_SCHEDULED', 'QUOTE_SENT', 'WON', 'LOST'),
      defaultValue: 'NEW',
      allowNull: false,
    },
    assigned_user_id: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    source: {
      type: Sequelize.STRING(50),
      defaultValue: 'LANDING_PAGE',
      allowNull: false,
    },
    privacy_policy_version: {
      type: Sequelize.STRING(20),
      defaultValue: '1.0',
      allowNull: false,
    },
    privacy_accepted_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    last_contact_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });

  await queryInterface.addIndex('leads', ['status'], { name: 'idx_leads_status' });
  await queryInterface.addIndex('leads', ['phone'], { name: 'idx_leads_phone' });
  await queryInterface.addIndex('leads', ['locality'], { name: 'idx_leads_locality' });
  await queryInterface.addIndex('leads', ['customer_type'], { name: 'idx_leads_customer_type' });
  await queryInterface.addIndex('leads', ['created_at'], { name: 'idx_leads_created_at' });
  await queryInterface.addIndex('leads', ['assigned_user_id'], { name: 'idx_leads_assigned_user' });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('leads');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leads_customer_type";');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leads_preferred_contact_method";');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leads_status";');
};
