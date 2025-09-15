"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserAccessToken = exports.verifyAdminAccessToken = void 0;
const Utils = __importStar(require("../lib/utils"));
const JwtUtils = __importStar(require("../lib/jwt.utils"));
const constants_1 = require("../lib/constants");
const users_model_1 = __importDefault(require("../models/users.model"));
function verifyAdminAccessToken(req, res, next) {
    try {
        const authToken = req.headers['authorization'];
        if (!authToken) {
            return res
                .status(Utils.statusCode.UNAUTHORIZED)
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(constants_1.ErrorMsg.USER.requireAuthToken)));
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
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(constants_1.ErrorMsg.EXCEPTIONS.wentWrong)));
    }
}
exports.verifyAdminAccessToken = verifyAdminAccessToken;
function verifyUserAccessToken(req, res, next) {
    try {
        const authToken = req.headers['authorization'];
        if (!authToken) {
            return res
                .status(Utils.statusCode.UNAUTHORIZED)
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(constants_1.ErrorMsg.USER.requireAuthToken)));
        }
        const bearer = authToken.split('Bearer ');
        const bearerToken = bearer[1];
        JwtUtils.verifyToken(bearerToken)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            req.userId = response.userId;
            req.token = bearerToken;
            req.user = yield users_model_1.default.findOne({ where: { id: response.userId }, raw: true });
            if (req.user.status === 'inactive') {
                return res
                    .status(Utils.statusCode.FORBIDDEN)
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(constants_1.ErrorMsg.USER.forbidden)));
            }
            else if (req.user.status === 'deleted') {
                return res
                    .status(Utils.statusCode.BAD_REQUEST)
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(constants_1.ErrorMsg.USER.notFound)));
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
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(constants_1.ErrorMsg.EXCEPTIONS.wentWrong)));
    }
}
exports.verifyUserAccessToken = verifyUserAccessToken;
//# sourceMappingURL=authGard.js.map