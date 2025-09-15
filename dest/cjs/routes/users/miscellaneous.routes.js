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
const misc_controller_1 = __importDefault(require("../../controller/users/misc.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const AuthGuard = __importStar(require("../../middleware/authGard"));
const fileUpload_utils_1 = require("../../lib/fileUpload.utils");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = (0, multer_1.default)({ storage: storage });
router.get('/countries', misc_controller_1.default.viewCountryData);
router.get('/legalcontent/:type', misc_controller_1.default.viewLegalContent);
router.get('/vehicle/types', misc_controller_1.default.viewVehicleTypes);
router.get('/faqs', misc_controller_1.default.viewFAQs);
router.get('/careers', misc_controller_1.default.viewAllCareers);
router.post('/contact/us', validation_middleware_1.default.validate(validation_middleware_1.default.schema.ContactUs), misc_controller_1.default.addContactUsData);
router.post('/career/apply', upload.single('resume'), fileUpload_utils_1.singleFileUpload, validation_middleware_1.default.validate(validation_middleware_1.default.schema.CareerApplication), misc_controller_1.default.applyForCareer);
router.get('/testimonials', misc_controller_1.default.viewTestimonial);
router.get('/blogs', misc_controller_1.default.viewBlogs);
router.get('/blogs/:blog_id', misc_controller_1.default.viewBlogById);
router.get('/refer_friends/:type', misc_controller_1.default.viewReferFriends);
router.get('/check/referal_code/:role', misc_controller_1.default.checkReferalCode);
router.get('/country_statistics', misc_controller_1.default.ViewCountryStateCity);
router.get('/vehicle_categories', misc_controller_1.default.ViewVehilceCategories);
router.get('/feedbacks/:role', AuthGuard.verifyAdminAccessToken, misc_controller_1.default.ViewAllFeedbacks);
router.get('/footer', misc_controller_1.default.ViewFooter);
router.get('/coupons', misc_controller_1.default.ViewCoupons);
router.get('/google/places', AuthGuard.verifyUserAccessToken, misc_controller_1.default.viewGooglePopular);
exports.default = router;
//# sourceMappingURL=miscellaneous.routes.js.map