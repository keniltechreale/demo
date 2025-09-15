import { Model } from 'sequelize';
export interface ICityManagement {
    id: number;
    vehicleTypes: number[];
    country: string;
    state: string;
    city: string;
    currency: string;
    symbol: string;
    code: string;
    distanceUnit: 'km' | 'miles';
    status: 'active' | 'inactive';
    documents: number[];
}
declare class CityManagement extends Model implements ICityManagement {
    id: number;
    country: string;
    state: string;
    city: string;
    currency: string;
    symbol: string;
    code: string;
    distanceUnit: 'km' | 'miles';
    status: 'active' | 'inactive';
    vehicleTypes: number[];
    documents: number[];
}
export default CityManagement;
