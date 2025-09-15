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
const useraddress_controller_1 = __importDefault(require("../../controller/users/useraddress.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const AuthGuard = __importStar(require("../../middleware/authGard"));
const router = express_1.default.Router();
router.post('/address', AuthGuard.verifyUserAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.UserAddress), useraddress_controller_1.default.addAddress);
router.get('/address', AuthGuard.verifyUserAccessToken, useraddress_controller_1.default.viewAllAddress);
router.patch('/address/:address_id', AuthGuard.verifyUserAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.UserAddress), useraddress_controller_1.default.updateAddress);
router.delete('/address/:address_id', AuthGuard.verifyUserAccessToken, useraddress_controller_1.default.deleteAddress);
router.post('/countries', useraddress_controller_1.default.addCountry);
exports.default = router;
//# sourceMappingURL=useraddress.routes.js.map