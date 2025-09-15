/// <reference types="node" />
import { IAdminUser } from '../models/admin.model';
import { IUser } from '../models/users.model';
export declare function createToken(payload: string | object | Buffer): Promise<string>;
export declare function verifyToken(token: string): Promise<IUser | IAdminUser>;
