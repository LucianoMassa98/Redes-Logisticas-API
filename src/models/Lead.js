import { DataTypes, Model } from 'sequelize';
import { LEAD_STATUSES, CUSTOMER_TYPES, PREFERRED_CONTACT_METHODS } from '../utils/constants.js';

export class Lead extends Model {
  static initModel(sequelize) {
    return Lead.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        fullName: {
          type: DataTypes.STRING(120),
          allowNull: false,
          field: 'full_name',
        },
        phone: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: true,
          validate: {
            isEmail: true,
          },
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        locality: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        province: {
          type: DataTypes.STRING(100),
          allowNull: true,
          defaultValue: 'Argentina',
        },
        customerType: {
          type: DataTypes.ENUM(...Object.values(CUSTOMER_TYPES)),
          allowNull: false,
          field: 'customer_type',
        },
        latitude: {
          type: DataTypes.DECIMAL(10, 8),
          allowNull: true,
        },
        longitude: {
          type: DataTypes.DECIMAL(11, 8),
          allowNull: true,
        },
        locationReference: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'location_reference',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        preferredContactMethod: {
          type: DataTypes.ENUM(...Object.values(PREFERRED_CONTACT_METHODS)),
          defaultValue: PREFERRED_CONTACT_METHODS.WHATSAPP,
          allowNull: false,
          field: 'preferred_contact_method',
        },
        status: {
          type: DataTypes.ENUM(...Object.values(LEAD_STATUSES)),
          defaultValue: LEAD_STATUSES.NEW,
          allowNull: false,
        },
        assignedUserId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'assigned_user_id',
        },
        source: {
          type: DataTypes.STRING(50),
          defaultValue: 'LANDING_PAGE',
        },
        privacyPolicyVersion: {
          type: DataTypes.STRING(20),
          defaultValue: '1.0',
          allowNull: false,
          field: 'privacy_policy_version',
        },
        privacyAcceptedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'privacy_accepted_at',
        },
        lastContactAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_contact_at',
        },
      },
      {
        sequelize,
        modelName: 'Lead',
        tableName: 'leads',
        underscored: true,
        timestamps: true,
      }
    );
  }
}
