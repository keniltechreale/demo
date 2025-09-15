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
const rides_controller_1 = __importDefault(require("../../controller/users/rides.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const fileUpload_utils_1 = require("../../lib/fileUpload.utils");
const AuthGuard = __importStar(require("../../middleware/authGard"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = (0, multer_1.default)({ storage: storage });
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
router.post('/', AuthGuard.verifyUserAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.Rides), rides_controller_1.default.addRides);
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
router.get('/', AuthGuard.verifyUserAccessToken, rides_controller_1.default.viewRides);
router.get('/:ride_id', AuthGuard.verifyUserAccessToken, rides_controller_1.default.viewRidesById);
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
router.patch('/:ride_id', AuthGuard.verifyUserAccessToken, upload.single('mapScreenshot'), fileUpload_utils_1.singleFileUpload, validation_middleware_1.default.validate(validation_middleware_1.default.schema.UpdateRides), rides_controller_1.default.updateRides);
router.delete('/:ride_id', AuthGuard.verifyUserAccessToken, rides_controller_1.default.deleteRides);
router.post('/add/country', AuthGuard.verifyAdminAccessToken, rides_controller_1.default.AddCountry);
router.patch('/update/country', AuthGuard.verifyAdminAccessToken, rides_controller_1.default.country);
router.get('/download/:ride_id', AuthGuard.verifyUserAccessToken, rides_controller_1.default.DownloadPdf);
exports.default = router;
//# sourceMappingURL=rides.routes.js.map