import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class Document extends Model {
}
Document.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maxFileCounts: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maxSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING,
    },
    vehicleTypes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    isRequired: {
        type: DataTypes.BOOLEAN,
    },
    status: {
        type: DataTypes.BOOLEAN,
    },
}, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: true,
});
export default Document;
//# sourceMappingURL=documents.model.js.map