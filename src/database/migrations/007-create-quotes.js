export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('quotes', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    lead_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'leads',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    amount: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    currency: {
      type: Sequelize.STRING(3),
      defaultValue: 'ARS',
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'),
      defaultValue: 'DRAFT',
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    sent_at: {
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

  await queryInterface.addIndex('quotes', ['lead_id'], { name: 'idx_quotes_lead_id' });
  await queryInterface.addIndex('quotes', ['created_by'], { name: 'idx_quotes_created_by' });
  await queryInterface.addIndex('quotes', ['status'], { name: 'idx_quotes_status' });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('quotes');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quotes_status";');
};
