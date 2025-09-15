var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Address from '../../models/useraddress.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Country from '../../models/countrydata.model';
import path from 'path';
import fs from 'fs';
export default new (class AddressService {
    addAddress(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAddress = yield Address.create(Object.assign({ user: userId }, args));
            return {
                message: SuccessMsg.ADDRESS.add,
                address: newAddress,
            };
        });
    }
    getAllAddress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressDetails = yield Address.findAll({ where: { user: userId } });
            return {
                message: SuccessMsg.ADDRESS.get,
                address: addressDetails,
            };
        });
    }
    updateAddress(args, addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Address.update(args, { where: { id: addressId } });
            const address = yield Address.findOne({ where: { id: addressId } });
            if (!address) {
                Utils.throwError(ErrorMsg.ADDRESS.notFound);
            }
            return {
                message: SuccessMsg.ADDRESS.update,
                address: address,
            };
        });
    }
    deleteAddress(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const AddressDetails = yield Address.destroy({
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
        });
    }
    AddCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path.join(__dirname, '../../CountryData_pretty.json');
                const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                console.log('Debug 2');
                for (const countryCode of Object.keys(jsonData.country)) {
                    const countryData = jsonData.country[countryCode];
                    console.log('Debug 3');
                    yield Country.create({
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
            }
            catch (error) {
                console.error('Error adding countries to the database:', error);
            }
        });
    }
})();
//# sourceMappingURL=useraddress.service.js.map