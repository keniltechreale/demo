"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = __importDefault(require("../config/jwt.config"));
function createToken(payload) {
    return new Promise((resolve, reject) => {
        try {
            const token = jsonwebtoken_1.default.sign(payload, jwt_config_1.default.secret, jwt_config_1.default.signOptions);
            resolve(token);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.createToken = createToken;
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, jwt_config_1.default.secret, function (err, decoded) {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.utils.js.map