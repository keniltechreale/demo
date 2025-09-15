import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addBlog: (req: IRequest, res: Response) => void;
    viewAllBlogs: (req: IRequest, res: Response) => void;
    updateBlog: (req: IRequest, res: Response) => void;
    deleteBlog: (req: IRequest, res: Response) => void;
};
export default _default;
