import Blogs, { IBlogs } from '../../models/blogs.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addBlogs(args: Record<string, unknown>): Promise<{
        message: string;
        blog: IBlogs;
    }>;
    getAllBlogs(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        blog: Blogs[];
    }>;
    updateBlogs(args: Record<string, unknown>, blogId: string): Promise<{
        message: string;
        blog: IBlogs;
    }>;
    deleteBlogs(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
