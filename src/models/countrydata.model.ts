import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface ICountryData {
  countryCode: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  shortName: string;
  longName: string;
  alpha2: string;
  alpha3: string;
  isoNumericCode: string;
  ioc: string;
  capitalCity: string;
  tld: string;
  symbol: string;
}

class Country extends Model<ICountryData> implements ICountryData {
  public countryCode!: string;
  public currencyCode!: string;
  public currencyName!: string;
  public currencySymbol!: string;
  public shortName!: string;
  public longName!: string;
  public alpha2!: string;
  public alpha3!: string;
  public isoNumericCode!: string;
  public ioc!: string;
  public capitalCity!: string;
  public tld!: string;
  public symbol!: string;
}

Country.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Country',
    tableName: 'countries',
    timestamps: false,
  },
);

export default Country;
