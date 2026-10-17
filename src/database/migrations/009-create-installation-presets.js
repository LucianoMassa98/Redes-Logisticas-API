export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('installation_presets', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    category: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'GENERAL',
    },
    icon: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'Layers',
    },
    labor_cost: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    markup_percent: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    },
    items: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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

  await queryInterface.addIndex('installation_presets', ['category']);
  await queryInterface.addIndex('installation_presets', ['is_active']);
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('installation_presets');
};
