import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class WeeklyStatement extends Model {
}
WeeklyStatement.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.NUMBER,
    },
    file: {
        type: DataTypes.STRING,
    },
    startDate: {
        type: DataTypes.STRING,
    },
    endDate: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'WeeklyStatement',
    tableName: 'weekly_statement',
    timestamps: true,
});
export default WeeklyStatement;
//# sourceMappingURL=weeklyStatement.model.js.map