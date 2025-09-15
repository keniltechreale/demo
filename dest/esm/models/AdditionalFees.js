import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class AdditionalFee extends Model {
}
AdditionalFee.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.ENUM('VAT', 'PlatformFee', 'AdminFee'),
        allowNull: false,
    },
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    applyOn: {
        type: DataTypes.ENUM('ride_total', 'cashout'),
        defaultValue: 'ride_total',
    },
}, {
    sequelize,
    modelName: 'AdditionalFee',
    tableName: 'additional_fees',
    timestamps: true,
});
export default AdditionalFee;
//# sourceMappingURL=AdditionalFees.js.map