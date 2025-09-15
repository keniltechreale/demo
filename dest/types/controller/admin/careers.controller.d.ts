import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addCareers: (req: IRequest, res: Response) => void;
    viewAllCareers: (req: IRequest, res: Response) => void;
    updateCareers: (req: IRequest, res: Response) => void;
    deleteCareers: (req: IRequest, res: Response) => void;
    viewCareerApplicationsByCareerId: (req: IRequest, res: Response) => void;
};
export default _default;
