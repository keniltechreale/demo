import * as Utils from '../lib/utils';
import * as JwtUtils from '../lib/jwt.utils';
import { ErrorMsg } from '../lib/constants';
import { Response, NextFunction } from 'express';
import { IAdminUser } from '../models/admin.model';
import Users, { IUser } from '../models/users.model';
import { IRequest } from '../lib/common.interface';

function verifyAdminAccessToken(req: IRequest, res: Response, next: NextFunction) {
  try {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      return res
        .status(Utils.statusCode.UNAUTHORIZED)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.USER.requireAuthToken)));
    }
    const bearer = authToken.split('Bearer ');
    const bearerToken = bearer[1];

    JwtUtils.verifyToken(bearerToken)
      .then((response: IAdminUser) => {
        req.admin = response;
        req.token = bearerToken;
        next();
      })
      .catch((error: Error) => {
        return res
          .status(Utils.statusCode.UNAUTHORIZED)
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
      });
  } catch (e) {
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.wentWrong)));
  }
}

function verifyUserAccessToken(req: IRequest, res: Response, next: NextFunction) {
  try {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      return res
        .status(Utils.statusCode.UNAUTHORIZED)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.USER.requireAuthToken)));
    }
    const bearer = authToken.split('Bearer ');
    const bearerToken = bearer[1];
    JwtUtils.verifyToken(bearerToken)
      .then(async (response: IUser) => {
        req.userId = response.userId;
        req.token = bearerToken;
        req.user = await Users.findOne({ where: { id: response.userId }, raw: true });
        if (req.user.status === 'inactive') {
          return res
            .status(Utils.statusCode.FORBIDDEN)
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.USER.forbidden)));
        } else if (req.user.status === 'deleted') {
          return res
            .status(Utils.statusCode.BAD_REQUEST)
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.USER.notFound)));
        }
        next();
      })
      .catch((error: Error) => {
        return res
          .status(Utils.statusCode.UNAUTHORIZED)
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
      });
  } catch (e) {
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.wentWrong)));
  }
}

export { verifyAdminAccessToken, verifyUserAccessToken };
