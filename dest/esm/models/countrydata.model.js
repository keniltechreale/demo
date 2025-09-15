import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class Country extends Model {
}
Country.init({
    countryCode: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    currencyCode: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    currencyName: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    currencySymbol: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    shortName: {
        type: DataTypes.STRING,
    },
    longName: {
        type: DataTypes.STRING,
    },
    alpha2: {
        type: DataTypes.STRING,
    },
    alpha3: {
        type: DataTypes.STRING,
    },
    isoNumericCode: {
        type: DataTypes.STRING,
    },
    ioc: {
        type: DataTypes.STRING,
    },
    capitalCity: {
        type: DataTypes.STRING,
    },
    tld: {
        type: DataTypes.STRING,
    },
    symbol: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Country',
    tableName: 'countries',
    timestamps: false,
});
export default Country;
//# sourceMappingURL=countrydata.model.js.map