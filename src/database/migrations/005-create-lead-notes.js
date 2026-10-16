export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('lead_notes', {
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
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    content: {
      type: Sequelize.TEXT,
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

  await queryInterface.addIndex('lead_notes', ['lead_id'], { name: 'idx_lead_notes_lead_id' });
  await queryInterface.addIndex('lead_notes', ['user_id'], { name: 'idx_lead_notes_user_id' });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('lead_notes');
};
