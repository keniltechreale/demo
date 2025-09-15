"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    DATABASE_HOST: config_1.default.DATABASE_HOST,
    DATABASE_USER_NAME: config_1.default.DATABASE_USER_NAME,
    DATABASE_PASSWORD: config_1.default.DATABASE_PASSWORD,
    DATABASE: config_1.default.DATABASE,
    // DB_PORT: config.DB_PORT,
};
//# sourceMappingURL=db.config.js.map