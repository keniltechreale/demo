import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addTestimonial: (req: IRequest, res: Response) => void;
    viewAllTestimonials: (req: IRequest, res: Response) => void;
    updateTestimonial: (req: IRequest, res: Response) => void;
    deleteTestimonial: (req: IRequest, res: Response) => void;
};
export default _default;
