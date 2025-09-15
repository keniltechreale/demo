import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class Testimonials extends Model {
}
Testimonials.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize,
    modelName: 'Testimonials',
    tableName: 'testimonials',
    timestamps: true,
});
export default Testimonials;
//# sourceMappingURL=testimonial.model.js.map