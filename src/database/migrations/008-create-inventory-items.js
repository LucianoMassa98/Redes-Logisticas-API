export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('inventory_items', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    cost_price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    stock_quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    min_stock_alert: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    unit: {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'UNIDAD',
    },
    markup_percent: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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

  await queryInterface.addIndex('inventory_items', ['code'], { name: 'idx_inventory_items_code', unique: true });
  await queryInterface.addIndex('inventory_items', ['category'], { name: 'idx_inventory_items_category' });
  await queryInterface.addIndex('inventory_items', ['is_active'], { name: 'idx_inventory_items_is_active' });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('inventory_items');
};
