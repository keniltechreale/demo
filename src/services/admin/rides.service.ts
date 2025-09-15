import Rides, { IRide } from '../../models/rides.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import Users from '../../models/users.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';

export default new (class RidesServices {
  async updateRides(args: Record<string, unknown>, orderId: string) {
    let rides: IRide = await Rides.findOne({ where: { id: orderId } });
    if (!Rides) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }
    await Rides.update(args, { where: { id: orderId } });
    rides = await Rides.findOne({ where: { id: orderId } });

    return {
      message: SuccessMsg.RIDES.updated,
      rides: rides,
    };
  }

  async getRides(rideId: string) {
    const ridesDetails: IRide = await Rides.findOne({
      where: { id: rideId },
      include: [
        {
          model: VehicleTypes,
        },
        {
          model: Users,
          as: 'driver',
          attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
        {
          model: Users,
          as: 'passenger',
          attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
      ],
    });
    if (!ridesDetails) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }
    return {
      message: SuccessMsg.RIDES.get,
      rides: ridesDetails,
    };
  }

  async getAllRides(arg: ISearch) {
    const { page, limit, search, status } = arg;
    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search && search.length > 0) {
      filterObject = {
        [Op.or]: [
          { origin: { [Op.like]: `%${search}%` } },
          { destination: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const totalCount = await Rides.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const ridesDetails = await Rides.findAll({
      where: filterObject,
      include: [
        {
          model: VehicleTypes,
        },
        {
          model: Users,
          as: 'driver',
          attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
        {
          model: Users,
          as: 'passenger',
          attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: false,
      nest: true,
    });

    return {
      message: SuccessMsg.RIDES.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      rides: ridesDetails,
    };
  }
  async getHistoryRides(arg: ISearch, userId: string, role: string) {
    const { page, limit, search, status } = arg;
    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (role === 'driver') {
      filterObject.driverId = userId;
    } else if (role === 'customer') {
      filterObject.passengerId = userId;
    }
    if (status) {
      filterObject.status = status;
    }
    if (search && search.length > 0) {
      filterObject = {
        [Op.or]: [
          { origin: { [Op.like]: `%${search}%` } },
          { destination: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const totalCount = await Rides.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const ridesDetails = await Rides.findAll({
      where: filterObject,
      include: [
        {
          model: VehicleTypes,
        },
        {
          model: Users,
          as: 'driver',
          attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
        {
          model: Users,
          as: 'passenger',
          attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: false,
      nest: true,
    });

    return {
      message: SuccessMsg.RIDES.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      rides: ridesDetails,
    };
  }
})();
