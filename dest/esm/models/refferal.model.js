import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class Referrals extends Model {
}
Referrals.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    referrer_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    referee_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    referral_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'expired'),
        defaultValue: 'pending',
    },
    valid_until: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    referrer_use_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    referee_use_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Referrals',
    tableName: 'referrals',
    timestamps: true,
});
export default Referrals;
//# sourceMappingURL=refferal.model.js.map