import { Op } from 'sequelize';
import { InstallationPreset, InventoryItem } from '../models/index.js';

export class PresetRepository {
  async findAll({ category = null, search = null, activeOnly = false } = {}) {
    const where = {};

    if (activeOnly) {
      where.isActive = true;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const presets = await InstallationPreset.findAll({
      where,
      order: [
        ['category', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    // Enriquecer cada preset con los detalles actualizados del inventario
    return this.enrichPresetsWithInventory(presets);
  }

  async findById(id) {
    const preset = await InstallationPreset.findByPk(id);
    if (!preset) return null;
    const [enriched] = await this.enrichPresetsWithInventory([preset]);
    return enriched;
  }

  async findByCode(code) {
    return InstallationPreset.findOne({
      where: { code: code.toUpperCase() },
    });
  }

  async create(data) {
    return InstallationPreset.create(data);
  }

  async update(id, updateData) {
    const [rowsUpdated] = await InstallationPreset.update(updateData, {
      where: { id },
    });
    return rowsUpdated > 0;
  }

  async delete(id) {
    return InstallationPreset.destroy({
      where: { id },
    });
  }

  /**
   * Toma un array de presets y busca los items en la tabla inventory_items
   * para adjuntar precio de costo, nombre, unidad y stock actual.
   */
  async enrichPresetsWithInventory(presets) {
    if (!presets || presets.length === 0) return [];

    // Recolectar todos los IDs de inventario únicos referenciados
    const allItemIds = new Set();
    presets.forEach((p) => {
      const items = Array.isArray(p.items) ? p.items : [];
      items.forEach((it) => {
        if (it.id) allItemIds.add(it.id);
      });
    });

    let inventoryMap = new Map();
    if (allItemIds.size > 0) {
      const dbItems = await InventoryItem.findAll({
        where: { id: { [Op.in]: Array.from(allItemIds) } },
      });
      inventoryMap = new Map(dbItems.map((it) => [it.id, it]));
    }

    return presets.map((p) => {
      const pJson = p.toJSON ? p.toJSON() : { ...p };
      const rawItems = Array.isArray(pJson.items) ? pJson.items : [];

      let totalPresetMaterialCost = 0;

      const populatedItems = rawItems.map((item) => {
        const inv = inventoryMap.get(item.id);
        const qty = Number(item.quantity) || 1;
        const unitCost = inv ? Number(inv.costPrice) : 0;
        const lineCost = unitCost * qty;
        totalPresetMaterialCost += lineCost;

        return {
          id: item.id,
          code: inv ? inv.code : item.code,
          name: inv ? inv.name : 'Artículo desconocido',
          category: inv ? inv.category : '',
          unit: inv ? inv.unit : 'UNIDAD',
          costPrice: unitCost,
          stockQuantity: inv ? inv.stockQuantity : 0,
          quantity: qty,
          lineCost,
          notes: item.notes || null,
        };
      });

      const laborCost = Number(pJson.laborCost) || 0;
      const totalEstimatedBaseCost = totalPresetMaterialCost + laborCost;

      return {
        ...pJson,
        items: populatedItems,
        summary: {
          totalMaterialCost: Math.round(totalPresetMaterialCost * 100) / 100,
          laborCost,
          totalEstimatedBaseCost: Math.round(totalEstimatedBaseCost * 100) / 100,
        },
      };
    });
  }
}

export const presetRepository = new PresetRepository();
