import express from 'express';
import MiscController from '../../controller/users/misc.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import { singleFileUpload } from '../../lib/fileUpload.utils';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({ storage: storage });
router.get('/countries', MiscController.viewCountryData);

router.get('/legalcontent/:type', MiscController.viewLegalContent);
router.get('/vehicle/types', MiscController.viewVehicleTypes);
router.get('/faqs', MiscController.viewFAQs);
router.get('/careers', MiscController.viewAllCareers);
router.post(
  '/contact/us',
  ValidationMiddleware.validate(ValidationMiddleware.schema.ContactUs),
  MiscController.addContactUsData,
);
router.post(
  '/career/apply',
  upload.single('resume'),
  singleFileUpload,
  ValidationMiddleware.validate(ValidationMiddleware.schema.CareerApplication),
  MiscController.applyForCareer,
);

router.get('/testimonials', MiscController.viewTestimonial);
router.get('/blogs', MiscController.viewBlogs);
router.get('/blogs/:blog_id', MiscController.viewBlogById);
router.get('/refer_friends/:type', MiscController.viewReferFriends);
router.get('/check/referal_code/:role', MiscController.checkReferalCode);
router.get('/country_statistics', MiscController.ViewCountryStateCity);
router.get('/vehicle_categories', MiscController.ViewVehilceCategories);

router.get('/feedbacks/:role', AuthGuard.verifyAdminAccessToken, MiscController.ViewAllFeedbacks);
router.get('/footer', MiscController.ViewFooter);
router.get('/coupons', MiscController.ViewCoupons);

router.get('/google/places', AuthGuard.verifyUserAccessToken, MiscController.viewGooglePopular);
export default router;
