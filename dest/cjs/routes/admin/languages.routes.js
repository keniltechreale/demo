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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const language_controller_1 = __importDefault(require("../../controller/admin/language.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const AuthGuard = __importStar(require("../../middleware/authGard"));
const router = express_1.default.Router();
router.post('/', AuthGuard.verifyAdminAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.Languages), language_controller_1.default.addLanguage);
router.get('/', AuthGuard.verifyAdminAccessToken, language_controller_1.default.viewAllLanguage);
router.patch('/:languages_id', AuthGuard.verifyAdminAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.Languages), language_controller_1.default.updateLanguage);
router.delete('/:languages_id', AuthGuard.verifyAdminAccessToken, language_controller_1.default.deleteLanguage);
exports.default = router;
//# sourceMappingURL=languages.routes.js.map