import UserLocation, { ILocation } from '../../models/userlocation.model';
import Vehicles, { IVehicle } from '../../models/vehicle.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Rides, { IRide } from '../../models/rides.model';
import Users, { IUser } from '../../models/users.model';
import { io } from '../../server';
import VehicleTypes, { IVehicleTypes } from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';
import Category, { ICategory } from '../../models/category.model';
import PriceManagement, { IPriceManagement } from '../../models/pricemanagement.model';
import { calculateDuration, getCity } from '../../lib/google.utils';
import { sendDriverNotification } from '../../lib/notifications.utils';
import Coupons from '../../models/coupon.model';
import AdditionalFee from '../../models/AdditionalFees';
import Referrals from '../../models/refferal.model';
export default new (class CustomerService {
  async ViewDashboard(args: { lat: number; long: number }) {
    const distanceInKm = 100;
    const rideLatitude = args.lat;
    const rideLongitude = args.long;

    const driversInRange: ILocation[] = await UserLocation.findAll({
      where: {
        status: true,
        [Op.and]: [
          {
            latitude: {
              [Op.gte]: rideLatitude - distanceInKm * (1 / 111.111),
              [Op.lte]: rideLatitude + distanceInKm * (1 / 111.111),
            },
          },
          {
            longitude: {
              [Op.gte]:
                rideLongitude -
                distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)), // Consider Earth's curvature for longitude
              [Op.lte]:
                rideLongitude +
                distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)),
            },
          },
        ],
      },
      attributes: ['user', 'latitude', 'longitude'],
      raw: true,
    });

    const driver_vehicle_types = await Promise.all(
      driversInRange.map(async (driver) => {
        const vehicle = await Vehicles.findOne({
          where: { user: driver.user },
          include: [
            {
              model: VehicleTypes,
            },
          ],
          raw: true,
          nest: true,
        });
        return vehicle?.VehicleType.name || 'Unknown';
      }),
    );

    const enrichedDrivers = driversInRange.map((driver, index) => ({
      ...driver,
      vehicleType: driver_vehicle_types[index],
    }));

    return {
      message: SuccessMsg.DRIVER.dashborad,
      driversInRange: enrichedDrivers,
    };
  }

  async AvailableVehicleCategories(rideId: string) {
    const ride: IRide = await Rides.findOne({ where: { id: rideId }, raw: true });
    // const distanceInKm = 100;
    const rideLatitude = ride.originLocation.lat;
    const rideLongitude = ride.originLocation.lng;
    const usersCity = await getCity(rideLatitude, rideLongitude);
    console.log('user city-------> ', usersCity);

    let driversInRange: ILocation[] = await UserLocation.findAll({
      where: {
        status: true,
        // [Op.and]: [
        //   {
        //     latitude: {
        //       [Op.gte]: rideLatitude - distanceInKm * (1 / 111.111),
        //       [Op.lte]: rideLatitude + distanceInKm * (1 / 111.111),
        //     },
        //   },
        //   {
        //     longitude: {
        //       [Op.gte]:
        //         rideLongitude -
        //         distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)), // Consider Earth's curvature for longitude
        //       [Op.lte]:
        //         rideLongitude +
        //         distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)),
        //     },
        //   },
        // ],
      },
      nest: true,
      raw: true,
    });
    driversInRange = await Promise.all(
      driversInRange.map(async (driver) => {
        const user = await Users.findOne({ where: { id: driver.user } });
        console.log(user.city);
        // if (user.driver_available && !user.driver_available.status) {
        //   return null;
        // } else
        return driver;
        // else if (user.city === usersCity) {
        // return driver;
        // }
      }),
    );
    driversInRange = driversInRange.filter((driver) => driver !== null);

    let driversWithDetails = await Promise.all(
      driversInRange.map(async (driver) => {
        try {
          const driverLocation = {
            lat: parseFloat(driver?.latitude),
            lng: parseFloat(driver?.longitude),
          };
          const durationData = await calculateDuration(driverLocation, ride.originLocation);
          if (!durationData) return null; // Skip this driver if distance calculation failed.

          const vehicleDetails: IVehicle = await Vehicles.findOne({
            where: { user: driver.user },
            attributes: ['user', 'category', 'type'],
            include: [{ model: Category }, { model: VehicleTypes }],
            nest: true,
            raw: true,
          });
          if (!vehicleDetails) return null;

          const price = await PriceManagement.findOne({
            where: { vehicleType: vehicleDetails.type, vehicleCategory: vehicleDetails.category },
            attributes: [
              'pricePerKm',
              'pricePerMin',
              'commissionPercentage',
              'nightCharges',
              'priceNightCharges',
              'nightStartTime',
              'nightEndTime',
            ],
            raw: true,
          });

          let fare: number | null = price ? ride.distanceInkm * price.pricePerKm : null;

          if (price.nightCharges) {
            let rideTime: string;
            const dateVal = ride.date as unknown;
            if (typeof dateVal === 'string') {
              const parts = dateVal.split(' ');
              rideTime = parts.length > 1 ? parts[1] : dateVal;
            } else if (dateVal instanceof Date) {
              rideTime = dateVal.toISOString().split('T')[1].split('.')[0];
            } else {
              throw new Error('Unsupported date format for ride.date');
            }

            const { nightStartTime, nightEndTime } = price;

            if (nightStartTime && nightEndTime) {
              const isNight =
                (rideTime >= nightStartTime && rideTime <= '23:59:59') ||
                (rideTime >= '00:00:00' && rideTime <= nightEndTime);

              if (isNight) {
                fare = Number((fare + Number(price.priceNightCharges)).toFixed(2));
              }
            }
          }

          let useFare = fare;

          const isAlreadyReferee = await Referrals.findOne({
            where: { referee_id: ride.passengerId },
            raw: true,
          });

          const referral = await Referrals.findOne({
            where: {
              [Op.and]: [
                {
                  [Op.or]: [
                    {
                      referee_id: ride.passengerId,
                      status: 'pending',
                      referee_use_count: { [Op.lt]: 2 },
                    },
                    {
                      referee_id: ride.passengerId,
                      status: 'completed',
                      referee_use_count: { [Op.lt]: 2 },
                    },
                    ...(isAlreadyReferee
                      ? []
                      : [
                          {
                            referrer_id: ride.passengerId,
                            status: 'completed',
                            referrer_use_count: { [Op.lt]: 2 },
                          },
                        ]),
                  ],
                },
                {
                  [Op.and]: [
                    { status: { [Op.ne]: 'expired' } },
                    { [Op.or]: [{ valid_until: null }, { valid_until: { [Op.gte]: new Date() } }] },
                  ],
                },
              ],
            },
            raw: true,
          });

          // Replace both if conditions with:
          if (referral && fare) {
            const discount = Math.min(fare * 0.5, 3000);
            useFare = Number((fare - discount).toFixed(2));
          }
          let finalAmount = useFare;
          const additionalFees = await AdditionalFee.findAll({
            where: { status: 'active', applyOn: 'ride_total' },
            raw: true,
          });

          let totalAdditionalFee = 0;
          if (useFare && additionalFees.length > 0) {
            additionalFees.forEach((fee) => {
              totalAdditionalFee += (useFare * fee.percentage) / 100;
            });
            finalAmount = useFare + totalAdditionalFee;
          }

          return {
            ...vehicleDetails,
            driverId: driver.user,
            fare,
            useFare,
            finalAmount,
            distanceInkm: durationData.distanceInkm,
            durationInmins: durationData.durationInmins,
          };
        } catch (err) {
          console.error('Error processing driver:', err);
          return null;
        }
      }),
    );
    driversWithDetails = driversWithDetails.filter((driver) => driver !== null);

    // console.log('driversWithDetails   --------------------------', driversWithDetails);

    const categoriesMap: {
      [key: number]: {
        category: ICategory;
        usefare: number;
        finalAmount: number;
        driverIds: string[];
        vehicleType: IVehicleTypes;
        distanceInkm: number;
        durationInmins: number;
      };
    } = {};

    driversWithDetails.forEach((details) => {
      const category = details.Category;
      const driverId = details.driverId;
      const vehicleType = details.VehicleType;
      const fare = details.useFare;
      const finalAmount = details.finalAmount;
      const distanceInkm = details.distanceInkm;
      const durationInmins = details.durationInmins;

      if (!categoriesMap[category.id]) {
        categoriesMap[category.id] = {
          category,
          usefare: fare,
          finalAmount,
          vehicleType: vehicleType,
          driverIds: [driverId],
          distanceInkm,
          durationInmins,
        };
      } else {
        if (!categoriesMap[category.id].driverIds.includes(driverId)) {
          categoriesMap[category.id].driverIds.push(driverId);
        }
        if (fare !== null) {
          categoriesMap[category.id].usefare = fare;
        }
        if (vehicleType !== null) {
          categoriesMap[category.id].vehicleType = vehicleType;
        }
        categoriesMap[category.id].distanceInkm = distanceInkm;
        categoriesMap[category.id].durationInmins = durationInmins;
      }
    });

    const uniqueCategoriesWithDrivers = Object.values(categoriesMap).map((item) => ({
      category: item.category,
      vehicleType: item.vehicleType,
      fare: item.usefare,
      finalAmount: item.finalAmount,
      driverIds: item.driverIds,
      distanceInkm: item.distanceInkm,
      durationInmins: item.durationInmins,
    }));

    await Rides.update({ driverAcceptStatus: 'pending' }, { where: { id: rideId } });

    return {
      status: 'success',
      message: 'Finding Driver for delivery',
      data: {
        ride: rideId,
        categoriesWithDrivers: uniqueCategoriesWithDrivers,
      },
    };
  }

  async selectDrivers(rideId: string, args: { driverIds: number[] }) {
    const vehicleDetails: IVehicle = await Vehicles.findOne({
      where: { user: args.driverIds },
      attributes: ['category', 'type'],
      raw: true,
    });

    console.log('vehicleDetails:---------------> ', vehicleDetails.category);
    const rideDetails = await Rides.findOne({
      where: { id: rideId },
      include: [
        {
          model: Users,
          as: 'passenger',
          attributes: ['name', 'profile_picture'],
        },
      ],
      raw: true,
      nest: true,
    });
    let rideTime: string;
    const dateVal = rideDetails?.date as unknown;

    if (typeof dateVal === 'string') {
      const parts = dateVal.split(' ');
      rideTime = parts.length > 1 ? parts[1] : dateVal;
    } else if (dateVal instanceof Date) {
      rideTime = dateVal.toISOString().split('T')[1].split('.')[0];
    } else {
      throw new Error('Unsupported date format for ride.date');
    }

    const price: IPriceManagement = await PriceManagement.findOne({
      where: { vehicleType: vehicleDetails.type, vehicleCategory: vehicleDetails.category },
      attributes: [
        'id',
        'pricePerKm',
        'pricePerMin',
        'commissionPercentage',
        'nightCharges',
        'priceNightCharges',
        'nightStartTime',
        'nightEndTime',
      ],
      raw: true,
    });

    let fare: number | null = price ? rideDetails.distanceInkm * price.pricePerKm : null;

    if (price) {
      if (price.nightCharges && price.nightStartTime && price.nightEndTime) {
        const isNight =
          (rideTime >= price.nightStartTime && rideTime <= '23:59:59') ||
          (rideTime >= '00:00:00' && rideTime <= price.nightEndTime);

        if (isNight) {
          fare += Number(price.priceNightCharges);
        }
      }
    }
    // -------------------- Referral Discount --------------------
    let useFare = fare;

    const isAlreadyReferee = await Referrals.findOne({
      where: { referee_id: rideDetails.passengerId },
      raw: true,
    });

    const referral = await Referrals.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                referee_id: rideDetails.passengerId,
                status: 'pending',
                referee_use_count: { [Op.lt]: 2 },
              },
              {
                referee_id: rideDetails.passengerId,
                status: 'completed',
                referee_use_count: { [Op.lt]: 2 },
              },
              ...(isAlreadyReferee
                ? []
                : [
                    {
                      referrer_id: rideDetails.passengerId,
                      status: 'completed',
                      referrer_use_count: { [Op.lt]: 2 },
                    },
                  ]),
            ],
          },
          {
            [Op.and]: [
              { status: { [Op.ne]: 'expired' } },
              { [Op.or]: [{ valid_until: null }, { valid_until: { [Op.gte]: new Date() } }] },
            ],
          },
        ],
      },
      raw: true,
    });

    if (referral && fare) {
      const discount = Math.min(fare * 0.5, 3000); // 50% off up to 3000
      useFare = Number((fare - discount).toFixed(2));
    }
    // -------------------- Commission Calculation --------------------
    let commissionAmount: number | null = null;
    if (price && useFare) {
      commissionAmount = Number(((Number(price.commissionPercentage) / 100) * useFare).toFixed(2));
    }

    // -------------------- Additional Fees --------------------
    const additionalFees = await AdditionalFee.findAll({
      where: { status: 'active', applyOn: 'ride_total' },
      raw: true,
    });

    let totalAdditionalFee = 0;
    if (fare && additionalFees.length > 0) {
      additionalFees.forEach((fee) => {
        totalAdditionalFee += (fare * fee.percentage) / 100;
      });
    }

    const finalAmount = useFare + totalAdditionalFee;

    // -------------------- Update Ride --------------------
    await Rides.update(
      {
        fare: fare,
        finalAmount: finalAmount,
        driverCommissionPer: price.commissionPercentage,
        driverCommissionAmount: commissionAmount,
      },
      {
        where: { id: rideId },
      },
    );

    await Promise.all(
      args.driverIds.map(async (driver: number) => {
        console.log(`Triggering socket event for driver: ${driver}`);
        io.of('/drivers').emit(`RideRequests_${driver}`, {
          message: { ...rideDetails, fare },
        });

        const user: IUser = await Users.findOne({ where: { id: driver } });
        if (user.fcm_token)
          await sendDriverNotification(user, {
            title: `You have an Ride Request`,
            type: `ride_request`,
            body: `There is request from a passenger for ride`,
            data: { ...rideDetails, fare, notification_type: 'Ride_Request' },
          });
      }),
    );

    await Rides.update({ driverAcceptStatus: 'pending' }, { where: { id: rideId } });

    return {
      message: SuccessMsg.DRIVER.searchDriver,
    };
  }

  async addInstructions(args: Record<string, unknown>, rideId: string) {
    const ride: IRide = await Rides.findOne({ where: { id: rideId } });
    if (!ride) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }

    await Rides.update(args, { where: { id: rideId } });
    const user: IUser = await Users.findOne({ where: { id: ride.driverId } });
    if (user.fcm_token) {
      await sendDriverNotification(user, {
        title: `Customer's Instruction`,
        type: `instructions`,
        body: `There is message from customer for you`,
        data: { rideId: rideId, notification_type: 'instructions' },
      });
    }
    return {
      message: SuccessMsg.DRIVER.addInstructions,
    };
  }

  async verifyCoupon(args: Record<string, unknown>, rideId: string, type: string) {
    const ride: IRide = await Rides.findOne({
      where: { id: rideId },
      raw: true,
    });
    if (!ride) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }
    const coupon = await Coupons.findOne({
      where: { code: args.code, status: 'active' },
      raw: true,
    });
    if (!coupon) {
      Utils.throwError(ErrorMsg.COUPONS.notFound);
    }
    if (coupon.isExpired) {
      Utils.throwError(ErrorMsg.COUPONS.expired);
    }
    let discount = 0;
    let totalAmount = 0;
    if (type == 'verify') {
      if (coupon.type === 'percentage') {
        discount = (coupon.maxDiscountAmount / 100) * ride.fare;
      } else if (coupon.type === 'fixed_money') {
        discount = coupon.maxDiscountAmount;
      }
      totalAmount = ride.fare - discount;
      if (totalAmount <= 0) {
        totalAmount = 0;
      }
    } else if (type == 'cancel') {
      await Rides.update({ coupon: null, finalAmount: ride.fare }, { where: { id: rideId } });
    }
    const updatedRide: IRide = await Rides.findOne({
      where: { id: rideId },
      include: [
        {
          model: Coupons,
          attributes: ['id', 'title', 'subTitle'],
        },
      ],
      raw: true,
      nest: true,
    });

    return {
      message: SuccessMsg.COUPONS.redeem,
      amount: totalAmount,
      ride: updatedRide,
    };
  }

  async redeemCoupons(args: Record<string, unknown>, rideId: string) {
    const coupon = await Coupons.findOne({
      where: { code: args.code, status: 'active', isExpired: false },
      raw: true,
    });

    if (!coupon) {
      Utils.throwError(ErrorMsg.COUPONS.invalid);
    }
    const ride: IRide = await Rides.findOne({
      where: { id: rideId },
      raw: true,
    });
    if (!ride) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }
    if (ride.coupon) {
      Utils.throwError(ErrorMsg.COUPONS.alreadyRedeem);
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (coupon.maxDiscountAmount / 100) * ride.fare;
    } else if (coupon.type === 'fixed_money') {
      discount = coupon.maxDiscountAmount;
    }
    let totalAmount = ride.fare - discount;
    if (totalAmount <= 0) {
      totalAmount = 0;
    }

    await Rides.update({ coupon: coupon.id, finalAmount: totalAmount }, { where: { id: rideId } });
    const updatedRide: IRide = await Rides.findOne({
      where: { id: rideId },
      include: [
        {
          model: Coupons,
          attributes: ['id', 'title', 'subTitle'],
        },
      ],
      raw: true,
      nest: true,
    });

    return {
      message: SuccessMsg.COUPONS.redeem,
      ride: updatedRide,
    };
  }
})();
