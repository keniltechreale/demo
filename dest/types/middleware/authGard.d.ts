import { Response, NextFunction } from 'express';
import { IRequest } from '../lib/common.interface';
declare function verifyAdminAccessToken(req: IRequest, res: Response, next: NextFunction): Response<any, Record<string, any>>;
declare function verifyUserAccessToken(req: IRequest, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export { verifyAdminAccessToken, verifyUserAccessToken };
