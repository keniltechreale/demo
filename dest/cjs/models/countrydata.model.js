"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Country extends sequelize_1.Model {
}
Country.init({
    countryCode: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    currencyCode: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    currencyName: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    currencySymbol: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    shortName: {
        type: sequelize_1.DataTypes.STRING,
    },
    longName: {
        type: sequelize_1.DataTypes.STRING,
    },
    alpha2: {
        type: sequelize_1.DataTypes.STRING,
    },
    alpha3: {
        type: sequelize_1.DataTypes.STRING,
    },
    isoNumericCode: {
        type: sequelize_1.DataTypes.STRING,
    },
    ioc: {
        type: sequelize_1.DataTypes.STRING,
    },
    capitalCity: {
        type: sequelize_1.DataTypes.STRING,
    },
    tld: {
        type: sequelize_1.DataTypes.STRING,
    },
    symbol: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Country',
    tableName: 'countries',
    timestamps: false,
});
exports.default = Country;
//# sourceMappingURL=countrydata.model.js.map