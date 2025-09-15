import { Response } from 'express';
import { IRequest } from '../../lib/common.interface';
declare const _default: {
    addCity: (req: IRequest, res: Response) => void;
    viewAllCity: (req: IRequest, res: Response) => void;
    updateCity: (req: IRequest, res: Response) => void;
    deleteCity: (req: IRequest, res: Response) => void;
};
export default _default;
