"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sociallogin_controller_1 = __importDefault(require("../../controller/users/sociallogin.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const multer_1 = __importDefault(require("multer"));
const fileUpload_utils_1 = require("../../lib/fileUpload.utils");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = (0, multer_1.default)({ storage: storage });
router.post('/google/register/customer', upload.single('profile_picture'), fileUpload_utils_1.singleFileUpload, validation_middleware_1.default.validate(validation_middleware_1.default.schema.UserRegister), sociallogin_controller_1.default.customerGoogleRegister);
router.post('/google/register/driver', upload.single('profile_picture'), fileUpload_utils_1.singleFileUpload, validation_middleware_1.default.validate(validation_middleware_1.default.schema.UserRegister), sociallogin_controller_1.default.driverGoogleRegister);
router.post('/google/login/customer', validation_middleware_1.default.validate(validation_middleware_1.default.schema.SocialLogin), sociallogin_controller_1.default.customerGoogleLogin);
router.post('/google/login/driver', validation_middleware_1.default.validate(validation_middleware_1.default.schema.SocialLogin), sociallogin_controller_1.default.driverGoogleLogin);
router.post('/facebook/register', upload.single('profile_picture'), fileUpload_utils_1.singleFileUpload, validation_middleware_1.default.validate(validation_middleware_1.default.schema.UserRegister), sociallogin_controller_1.default.facebookRegister);
router.post('/apple/register/:role', upload.single('profile_picture'), fileUpload_utils_1.singleFileUpload, validation_middleware_1.default.validate(validation_middleware_1.default.schema.AppleRegister), sociallogin_controller_1.default.AppleRegister);
router.post('/apple/login/:role', validation_middleware_1.default.validate(validation_middleware_1.default.schema.AppleLogin), sociallogin_controller_1.default.AppleLogin);
exports.default = router;
//# sourceMappingURL=sociallogin.routes.js.map