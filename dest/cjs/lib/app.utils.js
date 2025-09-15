"use strict";
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
const admin_model_1 = __importDefault(require("../models/admin.model"));
const logger_1 = __importDefault(require("./logger"));
exports.default = new (class AppUtils {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield admin_model_1.default.findOne({
                where: { email: 'admin@piupiu.com' },
            });
            if (!adminUser || adminUser == null) {
                yield admin_model_1.default.create({
                    id: 1,
                    name: 'admin',
                    email: 'admin@piupiu.com',
                    password: 'Admin@123',
                });
                logger_1.default.info('Admin User Created');
            }
            logger_1.default.info('App data initialized');
        });
    }
})();
//# sourceMappingURL=app.utils.js.map