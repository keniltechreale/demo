import { Model } from 'sequelize';
export interface IEmergencyContact {
    id: number;
    user_id: number;
    contact_name: string;
    isoCode: string;
    relationship?: string;
    country_code: string;
    phone_number: string;
    email?: string;
    verified: boolean;
}
declare class EmergencyContact extends Model<IEmergencyContact> implements IEmergencyContact {
    id: number;
    user_id: number;
    contact_name: string;
    relationship: string;
    isoCode: string;
    country_code: string;
    phone_number: string;
    email?: string;
    verified: boolean;
}
export default EmergencyContact;
