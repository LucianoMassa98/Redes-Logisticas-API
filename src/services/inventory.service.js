import Boom from '@hapi/boom';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { config } from '../config/env.js';

export class InventoryService {
  async getInventory(filters) {
    const result = await inventoryRepository.findAll(filters);
    const metrics = await inventoryRepository.getSummaryMetrics();
    const categories = await inventoryRepository.getCategories();

    // Agregar precio de venta calculado según markup por defecto o individual
    const defaultMarkup = config.installationMarkupPercent;
    const itemsWithPricing = result.items.map((item) => {
      const itemJson = item.toJSON();
      const markup = item.markupPercent !== null && item.markupPercent !== undefined
        ? Number(item.markupPercent)
        : defaultMarkup;
      const unitCost = Number(item.costPrice);
      const calculatedSalePrice = Math.round(unitCost * (1 + markup / 100));

      return {
        ...itemJson,
        effectiveMarkupPercent: markup,
        calculatedSalePrice,
        isLowStock: item.stockQuantity <= item.minStockAlert,
      };
    });

    return {
      ...result,
      items: itemsWithPricing,
      metrics,
      categories,
      systemDefaultMarkupPercent: defaultMarkup,
    };
  }

  async getItemById(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw Boom.notFound('El artículo de inventario no existe.');
    }
    const markup = item.markupPercent !== null && item.markupPercent !== undefined
      ? Number(item.markupPercent)
      : config.installationMarkupPercent;
    const unitCost = Number(item.costPrice);
    const calculatedSalePrice = Math.round(unitCost * (1 + markup / 100));

    return {
      ...item.toJSON(),
      effectiveMarkupPercent: markup,
      calculatedSalePrice,
      isLowStock: item.stockQuantity <= item.minStockAlert,
    };
  }

  async createItem(data) {
    const existing = await inventoryRepository.findByCode(data.code);
    if (existing) {
      throw Boom.conflict(`Ya existe un artículo con el código/SKU "${data.code}".`);
    }

    const created = await inventoryRepository.create(data);
    return this.getItemById(created.id);
  }

  async updateItem(id, updateData) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw Boom.notFound('El artículo no existe.');
    }

    if (updateData.code && updateData.code !== item.code) {
      const existing = await inventoryRepository.findByCode(updateData.code);
      if (existing && existing.id !== id) {
        throw Boom.conflict(`El código/SKU "${updateData.code}" ya está en uso.`);
      }
    }

    await inventoryRepository.update(id, updateData);
    return this.getItemById(id);
  }

  async adjustStock(id, { quantity, type = 'ADD', reason = '' }) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw Boom.notFound('El artículo no existe.');
    }

    let newStock = item.stockQuantity;
    if (type === 'ADD') {
      newStock += quantity;
    } else if (type === 'SUBTRACT') {
      newStock = Math.max(0, newStock - quantity);
    } else if (type === 'SET') {
      newStock = Math.max(0, quantity);
    }

    await inventoryRepository.updateStock(id, newStock);
    return this.getItemById(id);
  }

  async deleteItem(id) {
    const item = await inventoryRepository.findById(id);
    if (!item) {
      throw Boom.notFound('El artículo no existe en el inventario.');
    }

    await inventoryRepository.delete(id);
    return { success: true, message: `Artículo "${item.name}" eliminado correctamente.` };
  }

  /**
   * Calculador automático de cotizaciones e instalaciones:
   * Aplica costo + margen configurado (Costo + 100% por defecto desde .env)
   */
  async calculateQuotePrice({ items = [], laborCost = 0, customMarkupPercent = null }) {
    const defaultMarkup = config.installationMarkupPercent;
    const globalMarkup = customMarkupPercent !== null && customMarkupPercent !== undefined
      ? Number(customMarkupPercent)
      : defaultMarkup;

    const itemIds = items.map((i) => i.id);
    const dbItems = await inventoryRepository.findByIds(itemIds);
    const dbItemsMap = new Map(dbItems.map((db) => [db.id, db]));

    let totalMaterialCost = 0;
    let totalMaterialSalePrice = 0;

    const breakdownItems = items.map((reqItem) => {
      const dbItem = dbItemsMap.get(reqItem.id);
      if (!dbItem) {
        throw Boom.badRequest(`El artículo con ID ${reqItem.id} no existe en el inventario.`);
      }

      const qty = Number(reqItem.quantity);
      const unitCost = Number(dbItem.costPrice);
      const itemMarkup = dbItem.markupPercent !== null && dbItem.markupPercent !== undefined
        ? Number(dbItem.markupPercent)
        : globalMarkup;

      const lineCost = unitCost * qty;
      const unitSalePrice = Math.round(unitCost * (1 + itemMarkup / 100));
      const lineSalePrice = Math.round(lineCost * (1 + itemMarkup / 100));

      totalMaterialCost += lineCost;
      totalMaterialSalePrice += lineSalePrice;

      return {
        id: dbItem.id,
        code: dbItem.code,
        name: dbItem.name,
        category: dbItem.category,
        unit: dbItem.unit,
        quantity: qty,
        unitCost,
        lineCost,
        markupPercent: itemMarkup,
        unitSalePrice,
        lineSalePrice,
        lineProfit: lineSalePrice - lineCost,
      };
    });

    const parsedLaborCost = Number(laborCost) || 0;
    const totalLaborSalePrice = Math.round(parsedLaborCost * (1 + globalMarkup / 100));
    const laborProfit = totalLaborSalePrice - parsedLaborCost;

    const totalBaseCost = totalMaterialCost + parsedLaborCost;
    const totalFinalSalePrice = totalMaterialSalePrice + totalLaborSalePrice;
    const totalGrossProfit = totalFinalSalePrice - totalBaseCost;
    const effectiveTotalMarkupPercent = totalBaseCost > 0
      ? Math.round(((totalFinalSalePrice - totalBaseCost) / totalBaseCost) * 100)
      : globalMarkup;

    return {
      appliedMarkupPercent: globalMarkup,
      isCustomMarkup: customMarkupPercent !== null && customMarkupPercent !== undefined,
      systemDefaultMarkupPercent: defaultMarkup,
      summary: {
        totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
        totalMaterialSalePrice,
        totalLaborCost: parsedLaborCost,
        totalLaborSalePrice,
        totalBaseCost: Math.round(totalBaseCost * 100) / 100,
        totalFinalSalePrice,
        totalGrossProfit,
        effectiveTotalMarkupPercent,
      },
      items: breakdownItems,
    };
  }

  getSystemConfig() {
    return {
      installationMarkupPercent: config.installationMarkupPercent,
    };
  }
}

export const inventoryService = new InventoryService();
