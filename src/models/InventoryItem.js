import { DataTypes, Model } from 'sequelize';

export class InventoryItem extends Model {
  static initModel(sequelize) {
    return InventoryItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'MATERIALES',
        },
        costPrice: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
          field: 'cost_price',
        },
        stockQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'stock_quantity',
        },
        minStockAlert: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 5,
          field: 'min_stock_alert',
        },
        unit: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'UNIDAD',
        },
        markupPercent: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          field: 'markup_percent',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          field: 'is_active',
        },
      },
      {
        sequelize,
        modelName: 'InventoryItem',
        tableName: 'inventory_items',
        underscored: true,
        timestamps: true,
      }
    );
  }
}
