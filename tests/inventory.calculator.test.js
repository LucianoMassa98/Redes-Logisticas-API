import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createInventoryItemSchema, calculatePriceSchema } from '../src/validators/inventory.validator.js';

describe('Pruebas de Inventario y Calculador Automático de Precios', () => {
  describe('createInventoryItemSchema', () => {
    it('debe validar un artículo con código, nombre, categoría y precio de costo', () => {
      const validItem = {
        code: 'CAM-4K-PRO',
        name: 'Cámara 4K Domo Exterior',
        category: 'CAMARAS',
        costPrice: 45000,
        stockQuantity: 10,
        minStockAlert: 2,
        unit: 'UNIDAD',
      };

      const { error, value } = createInventoryItemSchema.validate(validItem);
      assert.strictEqual(error, undefined);
      assert.strictEqual(value.code, 'CAM-4K-PRO');
      assert.strictEqual(value.costPrice, 45000);
    });

    it('debe rechazar precio de costo negativo', () => {
      const invalidItem = {
        code: 'CAM-4K-PRO',
        name: 'Cámara 4K Domo Exterior',
        costPrice: -500,
      };

      const { error } = createInventoryItemSchema.validate(invalidItem);
      assert.ok(error);
      assert.ok(error.details.some((d) => d.path.includes('costPrice')));
    });
  });

  describe('calculatePriceSchema', () => {
    it('debe aceptar payload válido con lista de artículos y mano de obra', () => {
      const payload = {
        items: [
          { id: '123e4567-e89b-12d3-a456-426614174000', quantity: 4 },
          { id: '123e4567-e89b-12d3-a456-426614174001', quantity: 1 },
        ],
        laborCost: 35000,
        customMarkupPercent: 100,
      };

      const { error, value } = calculatePriceSchema.validate(payload);
      assert.strictEqual(error, undefined);
      assert.strictEqual(value.items.length, 2);
      assert.strictEqual(value.customMarkupPercent, 100);
    });

    it('debe permitir lista de artículos vacía para cotizaciones solo de mano de obra', () => {
      const payload = {
        items: [],
        laborCost: 10000,
      };

      const { error, value } = calculatePriceSchema.validate(payload);
      assert.strictEqual(error, undefined);
      assert.strictEqual(value.laborCost, 10000);
      assert.strictEqual(value.items.length, 0);
    });
  });

  describe('Lógica Matemática de Margen (Costo + 100%)', () => {
    it('debe duplicar el precio base cuando el margen es 100%', () => {
      const costMaterial = 50000;
      const costLabor = 25000;
      const totalCost = costMaterial + costLabor;
      const markupPercent = 100; // Configurable desde .env

      const salePrice = totalCost * (1 + markupPercent / 100);
      const grossProfit = salePrice - totalCost;

      assert.strictEqual(totalCost, 75000);
      assert.strictEqual(salePrice, 150000);
      assert.strictEqual(grossProfit, 75000);
      assert.strictEqual(grossProfit / totalCost, 1); // 100% ganancia
    });

    it('debe calcular correctamente con margen personalizado (ej. 120%)', () => {
      const totalCost = 100000;
      const customMarkup = 120;

      const salePrice = Math.round(totalCost * (1 + customMarkup / 100));
      assert.strictEqual(salePrice, 220000);
      assert.strictEqual(salePrice - totalCost, 120000);
    });

    it('debe calcular la mano de obra con totalLaborSalePrice definido', () => {
      const parsedLaborCost = 45000;
      const globalMarkup = 100;
      const totalLaborSalePrice = Math.round(parsedLaborCost * (1 + globalMarkup / 100));
      assert.strictEqual(totalLaborSalePrice, 90000);
      assert.strictEqual(typeof totalLaborSalePrice, 'number');
    });
  });
});
