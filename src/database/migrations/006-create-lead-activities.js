export const up = async ({ context: queryInterface, Sequelize }) => {
  await queryInterface.createTable('lead_activities', {
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
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    activity_type: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  });

  await queryInterface.addIndex('lead_activities', ['lead_id'], { name: 'idx_lead_activities_lead_id' });
  await queryInterface.addIndex('lead_activities', ['created_at'], { name: 'idx_lead_activities_created_at' });
};

export const down = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('lead_activities');
};
