var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from '../lib/utils';
import * as JwtUtils from '../lib/jwt.utils';
import { ErrorMsg } from '../lib/constants';
import Users from '../models/users.model';
function verifyAdminAccessToken(req, res, next) {
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
            .then((response) => {
            req.admin = response;
            req.token = bearerToken;
            next();
        })
            .catch((error) => {
            return res
                .status(Utils.statusCode.UNAUTHORIZED)
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
        });
    }
    catch (e) {
        return res
            .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.wentWrong)));
    }
}
function verifyUserAccessToken(req, res, next) {
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
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            req.userId = response.userId;
            req.token = bearerToken;
            req.user = yield Users.findOne({ where: { id: response.userId }, raw: true });
            if (req.user.status === 'inactive') {
                return res
                    .status(Utils.statusCode.FORBIDDEN)
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.USER.forbidden)));
            }
            else if (req.user.status === 'deleted') {
                return res
                    .status(Utils.statusCode.BAD_REQUEST)
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.USER.notFound)));
            }
            next();
        }))
            .catch((error) => {
            return res
                .status(Utils.statusCode.UNAUTHORIZED)
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
        });
    }
    catch (e) {
        return res
            .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.wentWrong)));
    }
}
export { verifyAdminAccessToken, verifyUserAccessToken };
//# sourceMappingURL=authGard.js.map