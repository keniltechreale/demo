"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    emailHost: config_1.default.EMAIL_HOST,
    emailPort: config_1.default.EMAIL_PORT,
    emailSecure: config_1.default.EMAIL_SECURE,
    emailService: config_1.default.EMAIL_SERVICE,
    emailUser: config_1.default.EMAIL_USER,
    emailpassword: config_1.default.EMAIL_PASSWORD,
};
//# sourceMappingURL=email.config.js.map