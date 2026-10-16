import { Op, fn, col, literal } from 'sequelize';
import { InventoryItem } from '../models/index.js';

export class InventoryRepository {
  async findAll({
    search = '',
    category = '',
    lowStockOnly = false,
    isActive = true,
    page = 1,
    limit = 50,
  } = {}) {
    const where = {};

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { code: { [Op.iLike || Op.like]: term } },
        { name: { [Op.iLike || Op.like]: term } },
        { description: { [Op.iLike || Op.like]: term } },
      ];
    }

    if (category && category.trim() !== '') {
      where.category = category.trim();
    }

    if (lowStockOnly) {
      where[Op.and] = literal('stock_quantity <= min_stock_alert');
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await InventoryItem.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['category', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit) || 1,
      items: rows,
    };
  }

  async findById(id) {
    return InventoryItem.findByPk(id);
  }

  async findByCode(code) {
    return InventoryItem.findOne({ where: { code: code.toUpperCase() } });
  }

  async findByIds(ids = []) {
    return InventoryItem.findAll({
      where: {
        id: { [Op.in]: ids },
      },
    });
  }

  async create(data, transaction) {
    return InventoryItem.create(data, { transaction });
  }

  async update(id, updateData, transaction) {
    const item = await InventoryItem.findByPk(id);
    if (!item) return null;
    await item.update(updateData, { transaction });
    return item;
  }

  async updateStock(id, newQuantity, transaction) {
    const item = await InventoryItem.findByPk(id);
    if (!item) return null;
    await item.update({ stockQuantity: newQuantity }, { transaction });
    return item;
  }

  async getCategories() {
    const categories = await InventoryItem.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
      raw: true,
    });
    return categories.map((c) => c.category).filter(Boolean);
  }

  async getSummaryMetrics() {
    const [totalItems, lowStockItems, totalVal] = await Promise.all([
      InventoryItem.count({ where: { isActive: true } }),
      InventoryItem.count({
        where: {
          isActive: true,
          [Op.and]: literal('stock_quantity <= min_stock_alert'),
        },
      }),
      InventoryItem.findAll({
        attributes: [
          [fn('SUM', literal('cost_price * stock_quantity')), 'totalValue'],
        ],
        where: { isActive: true },
        raw: true,
      }),
    ]);

    return {
      totalItems,
      lowStockItems,
      totalInventoryCostValue: parseFloat(totalVal[0]?.totalValue || 0),
    };
  }
}

export const inventoryRepository = new InventoryRepository();
