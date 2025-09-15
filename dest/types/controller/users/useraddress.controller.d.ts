import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addAddress: (req: IRequest, res: Response) => void;
    viewAllAddress: (req: IRequest, res: Response) => void;
    updateAddress: (req: IRequest, res: Response) => void;
    deleteAddress: (req: IRequest, res: Response) => void;
    addCountry: (req: IRequest, res: Response) => void;
};
export default _default;
