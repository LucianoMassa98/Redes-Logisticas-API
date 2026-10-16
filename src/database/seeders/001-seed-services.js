import { INITIAL_SERVICES } from '../../utils/constants.js';

export const up = async ({ context: queryInterface, Sequelize }) => {
  for (const s of INITIAL_SERVICES) {
    const existing = await queryInterface.rawSelect(
      'services',
      {
        where: { code: s.code },
      },
      ['id']
    );

    if (!existing) {
      await queryInterface.bulkInsert('services', [
        {
          id: Sequelize.fn('gen_random_uuid'),
          code: s.code,
          name: s.name,
          description: s.description,
          is_active: s.isActive,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  }
};

export const down = async ({ context: queryInterface }) => {
  const codes = INITIAL_SERVICES.map((s) => s.code);
  await queryInterface.bulkDelete('services', {
    code: codes,
  });
};
