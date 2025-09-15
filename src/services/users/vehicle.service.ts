import Vehicles, { IVehicle } from '../../models/vehicle.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { deleteAllFilesFromS3, deleteFilesFromS3 } from '../../lib/fileUpload.utils';
import Users, { IUser } from '../../models/users.model';
import { IVehicleData } from '../../middleware/validation.middleware';
import VehicleTypes from '../../models/vehicleTypes.model';
import Category from '../../models/category.model';
import Admin from '../../models/admin.model';
import Notifications from '../../models/notifications.model';

export default new (class VehicleService {
  async addVehicles(args: IVehicleData, userId: number) {
    const existVehicle: IVehicle = await Vehicles.findOne({ where: { user: userId } });
    if (existVehicle) {
      Utils.throwError(ErrorMsg.VEHICLE.alreadyExist);
    }
    const user: IUser = await Users.findOne({ where: { id: userId } });
    args.documents.push({
      title: 'Profile Picture',
      name: 'profile_picture',
      url: [user.profile_picture],
      status: 'pending',
      reason: undefined,
    });
    const admin = await Admin.findOne({ raw: true });
    await Notifications.create({
      admin: admin.id,
      title: 'Vehicle Documents Uploaded',
      type: 'vehicle_documents',
      body: `Driver ${user.name} has uploaded vehicle documents.`,
      meta_data: { user: user.id },
    });
    const newVehicle: IVehicle = await Vehicles.create({
      user: userId,
      ...args,
    });
    const vehicleType = await VehicleTypes.findOne({ where: { id: args.type }, raw: true });
    await Users.update({ driver_vehicle_type: vehicleType.name }, { where: { id: userId } });
    return {
      message: SuccessMsg.Vehicle.add,
      vehicle: newVehicle,
    };
  }

  async getVehiclesById(args: Record<string, unknown>) {
    const vehicleDetails: IVehicle = await Vehicles.findOne({
      where: { user: args.userId },
      include: [
        {
          model: VehicleTypes,
        },
        {
          model: Category,
        },
      ],
    });

    return {
      message: SuccessMsg.Vehicle.get,
      vehicle: vehicleDetails,
    };
  }

  async updateVehicles(
    args: IVehicleData,
    vehicleId: string,
    files: { [key: string]: Express.Multer.File[] },
  ) {
    const oldDetails: IVehicle = await Vehicles.findOne({ where: { id: vehicleId } });
    const vehicleDetails: IVehicle = await Vehicles.findOne({ where: { id: vehicleId } });
    if (!vehicleDetails) {
      Utils.throwError(ErrorMsg.VEHICLE.notFound);
    }
    const updateObj: Partial<IVehicle> = { ...args };
    delete updateObj.documents;

    if (args.documents && args.documents.length > 0) {
      args.documents.forEach((argDocument) => {
        const existingDocumentIndex = vehicleDetails.documents.findIndex(
          (doc) => doc.name === argDocument.name,
        );
        if (existingDocumentIndex !== -1) {
          vehicleDetails.documents[existingDocumentIndex] = { ...argDocument };
        }
      });
      updateObj.showCard = false;
      updateObj.documents = vehicleDetails.documents;
    }

    await Vehicles.update(updateObj, { where: { id: vehicleId } });
    const updatedDetails: IVehicle = await Vehicles.findOne({ where: { id: vehicleId } });
    await deleteFilesFromS3(files, oldDetails);

    return {
      message: SuccessMsg.Vehicle.update,
      vehicle: updatedDetails,
    };
  }

  async deleteVehicles(args: Record<string, unknown>) {
    const vehicleDetails: IVehicle = await Vehicles.findOne({ where: { id: args.vehicleId } });
    if (!vehicleDetails) {
      Utils.throwError(ErrorMsg.VEHICLE.notFound);
    }
    await Vehicles.destroy({ where: { id: args.vehicleId } });
    await deleteAllFilesFromS3(vehicleDetails);

    return {
      message: SuccessMsg.Vehicle.delete,
    };
  }
})();
