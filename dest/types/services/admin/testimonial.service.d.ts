import Testimonials, { ITestimonials } from '../../models/testimonial.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addTestimonials(args: Record<string, unknown>): Promise<{
        message: string;
        testimonial: ITestimonials;
    }>;
    getAllTestimonials(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        testimonial: Testimonials[];
    }>;
    updateTestimonials(args: Record<string, unknown>, testimonialId: string): Promise<{
        message: string;
        testimonial: ITestimonials;
    }>;
    deleteTestimonials(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
