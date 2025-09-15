import express from 'express';
import RidesController from '../../controller/users/rides.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import { singleFileUpload } from '../../lib/fileUpload.utils';
import * as AuthGuard from '../../middleware/authGard';
import multer from 'multer';
const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({ storage: storage });
/**
 * @swagger
 * tags:
 *   name: Rides
 *   description: API endpoints for vehicle
 */
/**
 * @swagger
 * /api/v1/rides:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the vehicle. Can be bike, car, van, or truck.
 *                 example: "bike"
 *               vehicle_image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the vehicle.
 *               vehicle_platenumber:
 *                 type: string
 *                 description: License plate number of the vehicle.
 *                 example: "HJ01GAF898"
 *               vehicle_color:
 *                 type: string
 *                 description: Color of the vehicle.
 *                 example: "blue"
 *               driving_license:
 *                 type: string
 *                 format: binary
 *                 description: Driving license of the user.
 *               ownership_certificate:
 *                 type: string
 *                 format: binary
 *                 description: Ownership certificate of the vehicle.
 *               roadworthiness:
 *                 type: string
 *                 format: binary
 *                 description: Roadworthiness certificate of the vehicle.
 *               document_lagos:
 *                 type: string
 *                 format: binary
 *                 description: Document related to Lagos.
 *     responses:
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 *       '200':
 *         description: Vehicle Added Successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: "Vehicle added successfully"
 *               data:
 *                 vehicle:
 *                   type: "bike"
 *                   verified: false
 *                   vehicle_image: "/vehicles/vehicle_image/289750c1-1d25-41a9-be41-9e5c08ac5056.jpeg"
 *                   vehicle_platenumber: "HJ01GAF898"
 *                   vehicle_color: "blue"
 *                   driving_license: "/vehicles/driving_license/b899071d-9bb3-469f-84df-8532be17b713.jpeg"
 *                   ownership_certificate: "/vehicles/ownership_certificate/a0eabd4f-7d85-462b-a52c-bb4ddde4a05b.svg"
 *                   roadworthiness: "/vehicles/roadworthiness/d4aad896-a628-4348-a907-1adff5582943.svg"
 *                   document_lagos: "/vehicles/document_lagos/86843e9a-65a2-4c56-a3d7-f58ea4cb1f4b.svg"
 *                   _id: "66069f253b5506f40cb527ed"
 *                   createdAt: "2024-03-29T10:59:49.914Z"
 *                   updatedAt: "2024-03-29T10:59:49.914Z"
 */
router.post('/', AuthGuard.verifyUserAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.Rides), RidesController.addRides);
/**
 * @swagger
 * /api/v1/rides:
 *   get:
 *     summary: Get all order
 *     tags: [rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful. Returns details of all vehicles.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: "Vehicles details fetch successfully"
 *               data:
 *                 page: 1
 *                 perPage: 25
 *                 totalCount: 1
 *                 totalPage: 1
 *                 vehicles:
 *                   - _id: "66069f253b5506f40cb527ed"
 *                     type: "bike"
 *                     verified: false
 *                     vehicle_image: "/vehicles/vehicle_image/289750c1-1d25-41a9-be41-9e5c08ac5056.jpeg"
 *                     vehicle_platenumber: "HJ01GAF898"
 *                     vehicle_color: "blue"
 *                     driving_license: "/vehicles/driving_license/b899071d-9bb3-469f-84df-8532be17b713.jpeg"
 *                     ownership_certificate: "/vehicles/ownership_certificate/a0eabd4f-7d85-462b-a52c-bb4ddde4a05b.svg"
 *                     roadworthiness: "/vehicles/roadworthiness/d4aad896-a628-4348-a907-1adff5582943.svg"
 *                     document_lagos: "/vehicles/document_lagos/86843e9a-65a2-4c56-a3d7-f58ea4cb1f4b.svg"
 *                     createdAt: "2024-03-29T10:59:49.914Z"
 *                     updatedAt: "2024-03-29T10:59:49.914Z"
 *                     __v: 0
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 */
router.get('/', AuthGuard.verifyUserAccessToken, RidesController.viewRides);
router.get('/:ride_id', AuthGuard.verifyUserAccessToken, RidesController.viewRidesById);
/**
 * @swagger
 * /api/v1/rides/{rides_id}:
 *   patch:
 *     summary: Update a rides by ID
 *     tags: [rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog Title.
 *                 example: "Welcome to our Blog"
 *               description:
 *                 type: string
 *                 description: The explanation of blog in details
 *                 example: "The content of blog is..."
 *               image:
 *                 type: string
 *                 description: Image URL.
 *                 example: "images/blogs/74ko-454i-45gb45fd45d45d.jpg"
 *               author:
 *                 type: string
 *                 description: Name of the author of the blog.
 *                 example: "John Doe"
 *     responses:
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 *       '200':
 *         description: Vehicle Updated Successfully.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 blog:
 *                   _id: "65a0e1654d942eda4a4d1f52"
 *                   user: "65a0e1654d942eda4a4d1l47"
 *                   type: "car"
 *                   vehicle_image: "images/blogs/74ko-454i-45gb45fd45d45d.jpg"
 *                   vehicle_license: "/vehicles/vehicle_image/9157dcab-c5e3-4c15-ab7b-3322e1b91c56.pdf"
 *                   createdAt: "2024-01-12T06:51:17.985Z"
 *                   updatedAt: "2024-01-12T06:51:17.985Z"
 *       '422':
 *         description: Validation error.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "title is required. description is required. author is required. image is required"
 *       '400':
 *         description: User not found or Vehicle not found.
 *         content:
 *           application/json:
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   status: error
 *                   message: "User not found"
 */
router.patch('/:ride_id', AuthGuard.verifyUserAccessToken, upload.single('mapScreenshot'), singleFileUpload, ValidationMiddleware.validate(ValidationMiddleware.schema.UpdateRides), RidesController.updateRides);
router.delete('/:ride_id', AuthGuard.verifyUserAccessToken, RidesController.deleteRides);
router.post('/add/country', AuthGuard.verifyAdminAccessToken, RidesController.AddCountry);
router.patch('/update/country', AuthGuard.verifyAdminAccessToken, RidesController.country);
router.get('/download/:ride_id', AuthGuard.verifyUserAccessToken, RidesController.DownloadPdf);
export default router;
//# sourceMappingURL=rides.routes.js.map