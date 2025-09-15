import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import * as bcrypt from 'bcrypt';
class Admin extends Model {
}
const saltRounds = 10;
Admin.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        // autoIncrement: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        set(value) {
            this.setDataValue('email', value.toLowerCase());
        },
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value) {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hashedPassword);
        },
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Admin',
    tableName: 'admin',
    timestamps: false,
});
export default Admin;
//# sourceMappingURL=admin.model.js.map