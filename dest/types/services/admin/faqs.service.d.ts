import FAQs, { IFAQs } from '../../models/faqs.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addFAQs(args: Record<string, unknown>): Promise<{
        message: string;
        faqs: IFAQs;
    }>;
    getAllFAQs(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        faqs: FAQs[];
    }>;
    updateFAQs(args: Record<string, unknown>, faqsId: string): Promise<{
        message: string;
        faqs: IFAQs;
    }>;
    deleteFAQs(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
