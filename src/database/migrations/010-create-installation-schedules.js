export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('installation_schedules', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    lead_id: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'leads',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    preset_id: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'installation_presets',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    title: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    client_name: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    client_phone: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    client_email: {
      type: Sequelize.STRING(150),
      allowNull: true,
    },
    client_address: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    locality: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    service_type: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'GENERAL',
    },
    scheduled_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: '09:00',
    },
    end_time: {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: '11:00',
    },
    duration_minutes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 120,
    },
    technician_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'CONFIRMED',
    },
    priority: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'NORMAL',
    },
    estimated_price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    materials: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    completed_at: {
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

  await queryInterface.addIndex('installation_schedules', ['scheduled_date']);
  await queryInterface.addIndex('installation_schedules', ['status']);
  await queryInterface.addIndex('installation_schedules', ['lead_id']);
  await queryInterface.addIndex('installation_schedules', ['assigned_user_id']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('installation_schedules');
};
