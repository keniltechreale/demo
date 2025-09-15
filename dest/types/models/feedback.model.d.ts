import { Model } from 'sequelize';
export interface IFeedbacks {
    id: number;
    question: string;
    keywords: number[];
    role: 'customer' | 'driver';
    status: 'active' | 'inactive';
}
declare class Feedbacks extends Model implements IFeedbacks {
    id: number;
    question: string;
    keywords: number[];
    status: 'active' | 'inactive';
    role: 'customer' | 'driver';
}
export default Feedbacks;
