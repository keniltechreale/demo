import Address, { IAddress } from '../../models/useraddress.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Country from '../../models/countrydata.model';
import path from 'path';
import fs from 'fs';

export default new (class AddressService {
  async addAddress(args: Record<string, unknown>, userId: number) {
    const newAddress: IAddress = await Address.create({ user: userId, ...args });

    return {
      message: SuccessMsg.ADDRESS.add,
      address: newAddress,
    };
  }

  async getAllAddress(userId: number) {
    const addressDetails = await Address.findAll({ where: { user: userId } });

    return {
      message: SuccessMsg.ADDRESS.get,
      address: addressDetails,
    };
  }

  async updateAddress(args: Record<string, unknown>, addressId: string) {
    await Address.update(args, { where: { id: addressId } });

    const address: IAddress = await Address.findOne({ where: { id: addressId } });
    if (!address) {
      Utils.throwError(ErrorMsg.ADDRESS.notFound);
    }
    return {
      message: SuccessMsg.ADDRESS.update,
      address: address,
    };
  }

  async deleteAddress(args: Record<string, unknown>, userId: number) {
    const AddressDetails = await Address.destroy({
      where: {
        id: args.addressId,
        user: userId,
      },
    });
    if (!AddressDetails) {
      Utils.throwError(ErrorMsg.ADDRESS.notFound);
    }
    return {
      message: SuccessMsg.ADDRESS.delete,
    };
  }

  async AddCountry() {
    try {
      const filePath = path.join(__dirname, '../../CountryData_pretty.json');
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      console.log('Debug 2');

      for (const countryCode of Object.keys(jsonData.country)) {
        const countryData = jsonData.country[countryCode];
        console.log('Debug 3');

        await Country.create({
          countryCode,
          currencyCode: countryData.currency.currencyCode,
          currencyName: countryData.currency.currencyName,
          currencySymbol: countryData.currency.currencySymbol,
          shortName: countryData.info.shortName,
          longName: countryData.info.longName,
          alpha2: countryData.info.alpha2,
          alpha3: countryData.info.alpha3,
          isoNumericCode: countryData.info.isoNumericCode,
          ioc: countryData.info.ioc,
          capitalCity: countryData.info.capitalCity,
          tld: countryData.info.tld,
        });
      }
      console.log('Debug 5');

      console.log('Countries added to the database successfully!');
      return {
        message: SuccessMsg.USER.count,
      };
    } catch (error) {
      console.error('Error adding countries to the database:', error);
    }
  }
})();
