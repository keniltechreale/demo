import { Model } from 'sequelize';
export interface IContactUs {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    message: string;
    replied: boolean;
    replyContent: string;
    createdAt?: Date;
    updatedAt?: Date;
}
declare class ContactUs extends Model<IContactUs> implements IContactUs {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    message: string;
    replied: boolean;
    replyContent: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default ContactUs;
