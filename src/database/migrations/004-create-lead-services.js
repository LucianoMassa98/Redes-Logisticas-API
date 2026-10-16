export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('lead_services', {
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
    service_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });

  await queryInterface.addIndex('lead_services', ['lead_id', 'service_id'], {
    name: 'idx_lead_services_unique_composite',
    unique: true,
  });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('lead_services');
};
