import { Model } from 'sequelize';
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
declare class Country extends Model<ICountryData> implements ICountryData {
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
export default Country;
