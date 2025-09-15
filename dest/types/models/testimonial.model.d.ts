import { Model } from 'sequelize';
export interface ITestimonials {
    id: number;
    image: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
}
declare class Testimonials extends Model<ITestimonials> implements ITestimonials {
    id: number;
    image: string;
    name: string;
    description: string;
    status: 'active' | 'inactive';
}
export default Testimonials;
