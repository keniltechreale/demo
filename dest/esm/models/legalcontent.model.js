import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class LegalContent extends Model {
}
LegalContent.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING(50),
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'LegalContent',
    tableName: 'legalcontents',
    timestamps: true,
});
export default LegalContent;
//# sourceMappingURL=legalcontent.model.js.map