import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config';
import { IAdminUser } from '../models/admin.model';
import { IUser } from '../models/users.model';

export function createToken(payload: string | object | Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(payload, jwtConfig.secret, jwtConfig.signOptions);
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
}

export function verifyToken(token: string): Promise<IUser | IAdminUser> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtConfig.secret, function (err, decoded) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as IUser | IAdminUser);
      }
    });
  });
}
