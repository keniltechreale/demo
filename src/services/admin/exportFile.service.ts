import Users from '../../models/users.model';
import { ISearch } from '../../lib/common.interface';
import { Op } from 'sequelize';
import Ride from '../../models/rides.model';
import CashoutRequests from '../../models/cashoutRequest.model';

export default new (class ExportFilesService {
  async exportCSVFiles(arg: ISearch, type: string) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
    let totalCount = 0;
    let totalPage = 0;
    let details: any[] = [];

    if (status) {
      filterObject.status = status;
    }

    // Common search logic
    const addSearchFilters = (fields: string[]) => {
      if (search && search.length > 0) {
        filterObject = {
          ...filterObject,
          [Op.or]: fields.map((field) => ({
            [field]: { [Op.like]: `%${search}%` },
          })),
        };
      }
    };

    switch (type) {
      case 'driver':
      case 'customer':
        filterObject.role = type;
        addSearchFilters(['name', 'last_name', 'email', 'phone_number', 'user_id']);

        totalCount = await Users.count({ where: filterObject });
        totalPage = limit ? Math.ceil(totalCount / limit) : 1;
        details = await Users.findAll({
          where: filterObject,
          attributes: {
            exclude: [
              'mpin',
              'profile_picture',
              'ongoing_rides',
              'driver_available',
              'fcm_token',
              'createdAt',
              'updatedAt',
            ],
          },
          order: [['createdAt', 'DESC']],
          offset: limit && page ? skip : undefined,
          limit: limit || undefined,
          raw: true,
        });
        break;

      case 'rides':
        addSearchFilters(['origin', 'destination']);

        totalCount = await Ride.count({ where: filterObject });
        totalPage = limit ? Math.ceil(totalCount / limit) : 1;
        details = await Ride.findAll({
          where: filterObject,
          order: [['createdAt', 'DESC']],
          offset: limit && page ? skip : undefined,
          limit: limit || undefined,
          raw: true,
        });
        break;

      case 'cashout':
        if (search && search.length > 0) {
          filterObject['$or'] = [{ amount: { [Op.like]: `%${search}%` } }];
        }

        totalCount = await CashoutRequests.count({ where: filterObject });
        totalPage = limit ? Math.ceil(totalCount / limit) : 1;
        details = await CashoutRequests.findAll({
          where: filterObject,
          order: [['createdAt', 'DESC']],
          offset: limit && page ? skip : undefined,
          limit: limit || undefined,
          raw: true,
        });
        break;

      default:
        throw new Error('Invalid type specified');
    }

    return {
      page,
      perPage: limit || totalCount,
      totalCount,
      totalPage,
      details: details || [],
    };
  }
})();
0;
