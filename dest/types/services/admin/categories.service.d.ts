import Category, { ICategory } from '../../models/category.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addCategory(args: Record<string, unknown>, type: string): Promise<{
        message: string;
        category: ICategory;
    }>;
    getAllCategory(arg: ISearch, type: string): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        category: Category[];
    }>;
    updateCategorys(args: Record<string, unknown>, categoryId: string): Promise<{
        message: string;
        category: ICategory;
    }>;
    deleteCategorys(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
