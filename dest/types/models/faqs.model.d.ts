import { Model } from 'sequelize';
export interface IFAQs {
    id: number;
    question: string;
    answer: string;
    serial_number: number;
    status: 'active' | 'inactive';
}
declare class FAQs extends Model implements IFAQs {
    id: number;
    question: string;
    answer: string;
    serial_number: number;
    status: 'active' | 'inactive';
}
export default FAQs;
