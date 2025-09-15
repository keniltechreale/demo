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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useraddress_model_1 = __importDefault(require("../../models/useraddress.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const countrydata_model_1 = __importDefault(require("../../models/countrydata.model"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.default = new (class AddressService {
    addAddress(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAddress = yield useraddress_model_1.default.create(Object.assign({ user: userId }, args));
            return {
                message: constants_1.SuccessMsg.ADDRESS.add,
                address: newAddress,
            };
        });
    }
    getAllAddress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressDetails = yield useraddress_model_1.default.findAll({ where: { user: userId } });
            return {
                message: constants_1.SuccessMsg.ADDRESS.get,
                address: addressDetails,
            };
        });
    }
    updateAddress(args, addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield useraddress_model_1.default.update(args, { where: { id: addressId } });
            const address = yield useraddress_model_1.default.findOne({ where: { id: addressId } });
            if (!address) {
                Utils.throwError(constants_1.ErrorMsg.ADDRESS.notFound);
            }
            return {
                message: constants_1.SuccessMsg.ADDRESS.update,
                address: address,
            };
        });
    }
    deleteAddress(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const AddressDetails = yield useraddress_model_1.default.destroy({
                where: {
                    id: args.addressId,
                    user: userId,
                },
            });
            if (!AddressDetails) {
                Utils.throwError(constants_1.ErrorMsg.ADDRESS.notFound);
            }
            return {
                message: constants_1.SuccessMsg.ADDRESS.delete,
            };
        });
    }
    AddCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path_1.default.join(__dirname, '../../CountryData_pretty.json');
                const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
                console.log('Debug 2');
                for (const countryCode of Object.keys(jsonData.country)) {
                    const countryData = jsonData.country[countryCode];
                    console.log('Debug 3');
                    yield countrydata_model_1.default.create({
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
                    message: constants_1.SuccessMsg.USER.count,
                };
            }
            catch (error) {
                console.error('Error adding countries to the database:', error);
            }
        });
    }
})();
//# sourceMappingURL=useraddress.service.js.map