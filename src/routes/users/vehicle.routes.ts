import express from 'express';
import VehicleController from '../../controller/users/vehicle.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import { multipleFileUpload } from '../../lib/fileUpload.utils';
import { uploadFunction } from '../../lib/fileMiddleware';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: API endpoints for vehicle
 */

/**
 * @swagger
 * /api/v1/vehicles:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
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

router.post(
  '/',
  AuthGuard.verifyUserAccessToken,
  uploadFunction,
  multipleFileUpload,
  ValidationMiddleware.validate(ValidationMiddleware.schema.Vehicle),
  VehicleController.addVehicle,
);

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
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

router.get('/', AuthGuard.verifyUserAccessToken, VehicleController.viewVehicles);

/**
 * @swagger
 * /api/v1/vehicles/{vehicle_id}:
 *   patch:
 *     summary: Update a vehicle by ID
 *     tags: [Vehicles]
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

router.patch(
  '/:vehicle_id',
  AuthGuard.verifyUserAccessToken,
  uploadFunction,
  multipleFileUpload,
  ValidationMiddleware.validate(ValidationMiddleware.schema.UpdateVehicle),
  VehicleController.updateVehicle,
);

/**
 * @swagger
 * /api/v1/vehicles/{vehicle_id}:
 *   delete:
 *     summary: Delete a vehicle by ID
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vehicle ID
 *     responses:
 *       '200':
 *         description: Successful.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 message: "Vehicle Deleted successfully"
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 *       '400':
 *         description: User not found
 *         content:
 *           application/json:
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   status: error
 *                   message: "User not found"
 */

router.delete('/:vehicle_id', AuthGuard.verifyUserAccessToken, VehicleController.deleteVehicle);

export default router;
