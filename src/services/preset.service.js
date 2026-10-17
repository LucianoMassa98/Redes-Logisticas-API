import Boom from '@hapi/boom';
import { presetRepository } from '../repositories/preset.repository.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';

export class PresetService {
  async listPresets(filters) {
    return presetRepository.findAll(filters);
  }

  async getPresetById(id) {
    const preset = await presetRepository.findById(id);
    if (!preset) {
      throw Boom.notFound('La plantilla de instalación no existe.');
    }
    return preset;
  }

  async createPreset(data) {
    const existing = await presetRepository.findByCode(data.code);
    if (existing) {
      throw Boom.conflict(`Ya existe una plantilla con el código "${data.code}".`);
    }

    // Validar que los items existan en el inventario
    if (data.items && data.items.length > 0) {
      const itemIds = data.items.map((i) => i.id);
      const dbItems = await inventoryRepository.findByIds(itemIds);
      if (dbItems.length !== itemIds.length) {
        throw Boom.badRequest('Uno o más artículos seleccionados no existen en el inventario.');
      }
    }

    const created = await presetRepository.create(data);
    return presetRepository.findById(created.id);
  }

  async updatePreset(id, data) {
    const existing = await presetRepository.findById(id);
    if (!existing) {
      throw Boom.notFound('La plantilla no existe.');
    }

    if (data.code && data.code !== existing.code) {
      const codeTaken = await presetRepository.findByCode(data.code);
      if (codeTaken && codeTaken.id !== id) {
        throw Boom.conflict(`El código "${data.code}" ya está siendo utilizado por otra plantilla.`);
      }
    }

    if (data.items && data.items.length > 0) {
      const itemIds = data.items.map((i) => i.id);
      const dbItems = await inventoryRepository.findByIds(itemIds);
      if (dbItems.length !== itemIds.length) {
        throw Boom.badRequest('Uno o más artículos seleccionados no existen en el inventario.');
      }
    }

    await presetRepository.update(id, data);
    return presetRepository.findById(id);
  }

  async deletePreset(id) {
    const existing = await presetRepository.findById(id);
    if (!existing) {
      throw Boom.notFound('La plantilla no existe.');
    }
    await presetRepository.delete(id);
    return { success: true, message: 'Plantilla eliminada correctamente' };
  }
}

export const presetService = new PresetService();
