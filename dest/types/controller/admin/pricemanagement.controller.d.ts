import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addPriceManagement: (req: IRequest, res: Response) => void;
    viewPriceManagementById: (req: IRequest, res: Response) => void;
    viewAllPriceManagements: (req: IRequest, res: Response) => void;
    updatePriceManagement: (req: IRequest, res: Response) => void;
    deletePriceManagement: (req: IRequest, res: Response) => void;
};
export default _default;
