import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class CareerApplications extends Model {
}
CareerApplications.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    career_id: {
        type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    resume: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired'),
        defaultValue: 'pending',
    },
}, {
    sequelize,
    modelName: 'CareerApplications',
    tableName: 'career_applications',
    timestamps: true,
});
export default CareerApplications;
//# sourceMappingURL=careerApplications.model.js.map