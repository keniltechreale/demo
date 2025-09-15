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
const delivery_controller_1 = __importDefault(require("../../controller/users/delivery.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const AuthGuard = __importStar(require("../../middleware/authGard"));
const router = express_1.default.Router();
router.get('/documents', AuthGuard.verifyUserAccessToken, delivery_controller_1.default.GetDocuments);
router.get('/dashboard', AuthGuard.verifyUserAccessToken, delivery_controller_1.default.dashboard);
router.get('/instructions', AuthGuard.verifyUserAccessToken, delivery_controller_1.default.viewCustomerInstructions);
router.post('/connection/status', AuthGuard.verifyUserAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.ChangeConnectionStatus), delivery_controller_1.default.ChangeConnectionStatus);
router.post('/rides/request/:ride_id/:type', AuthGuard.verifyUserAccessToken, delivery_controller_1.default.rideRequest);
router.post('/verify/request/:ride_id', AuthGuard.verifyUserAccessToken, delivery_controller_1.default.verifyRidesOtp);
router.get('/instructions/:ride_id', AuthGuard.verifyUserAccessToken, delivery_controller_1.default.viewCustomerInstructions);
router.get('/statistics', AuthGuard.verifyUserAccessToken, delivery_controller_1.default.viewStatistics);
router.post('/distance/counts/:ride_id', AuthGuard.verifyUserAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.GoOnline), delivery_controller_1.default.DistanceCount);
exports.default = router;
//# sourceMappingURL=driver.routes.js.map