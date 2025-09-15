"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
exports.default = {
    apiKey: config_1.default.PROXYPAY_API_KEY,
    sandbox: config_1.default.PROXYPAY_SANDBOX,
    baseUrlSandbox: config_1.default.PROXYPAY_BASE_URL_SANDBOX,
    baseUrlProduction: config_1.default.PROXYPAY_BASE_URL_PRODUCTION,
};
//# sourceMappingURL=payment.config.js.map