"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    secret: config_1.default.JWT_SECRET,
    signOptions: {
        expiresIn: '15d',
        algorithm: 'HS256',
    },
};
//# sourceMappingURL=jwt.config.js.map