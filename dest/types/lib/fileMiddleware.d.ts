import { NextFunction, Response } from 'express';
import { IRequest } from '../lib/common.interface';
export declare function uploadMultipleDoc(req: IRequest, res: Response, next: NextFunction): Promise<void>;
export declare const uploadFunction: (req: IRequest, res: Response, next: NextFunction) => void;
