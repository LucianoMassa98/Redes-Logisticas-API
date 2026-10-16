import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { USER_ROLES } from '../utils/constants.js';

export class User extends Model {
  static initModel(sequelize) {
    return User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        fullName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'full_name',
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'password_hash',
        },
        role: {
          type: DataTypes.ENUM(USER_ROLES.ADMIN, USER_ROLES.COMMERCIAL),
          defaultValue: USER_ROLES.COMMERCIAL,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          field: 'is_active',
        },
        lastLoginAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'last_login_at',
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        timestamps: true,
      }
    );
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  }
}
