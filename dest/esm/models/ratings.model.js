import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User from './users.model';
import Rides from './rides.model';
class Rating extends Model {
}
Rating.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    driver: {
        type: DataTypes.NUMBER,
        references: {
            model: User,
            key: 'id',
        },
    },
    ride: {
        type: DataTypes.NUMBER,
        references: {
            model: Rides,
            key: 'id',
        },
    },
    type: {
        type: DataTypes.STRING,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stars: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: true,
});
Rating.belongsTo(User, {
    foreignKey: 'user',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Rating.belongsTo(User, {
    foreignKey: 'driver',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Rating.belongsTo(Rides, {
    foreignKey: 'ride',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
export default Rating;
//# sourceMappingURL=ratings.model.js.map