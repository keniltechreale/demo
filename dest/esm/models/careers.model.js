import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Categories from './category.model';
class Career extends Model {
}
Career.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    role: {
        type: DataTypes.STRING,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    requirements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    salaryRange: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    category: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Categories,
            key: 'id',
        },
    },
    postedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Career',
    tableName: 'careers',
    timestamps: false,
});
Career.belongsTo(Categories, { foreignKey: 'category', targetKey: 'id' });
export default Career;
//# sourceMappingURL=careers.model.js.map