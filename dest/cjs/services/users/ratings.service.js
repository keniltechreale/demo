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
const ratings_model_1 = __importDefault(require("../../models/ratings.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
exports.default = new (class CityService {
    addRating(args, userId, driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existRating = yield ratings_model_1.default.findOne({
                where: {
                    user: userId,
                    driver: driverId,
                },
            });
            if (existRating) {
                Utils.throwError(constants_1.ErrorMsg.RATINGS.alreadyExist);
            }
            const newRating = yield ratings_model_1.default.create(Object.assign({ user: userId, driver: parseInt(driverId) }, args));
            return {
                message: constants_1.SuccessMsg.RATINGS.add,
                rating: newRating,
            };
        });
    }
    getAllRating(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ratingCount = yield ratings_model_1.default.count({ where: { driver: userId } });
            const ratingDetails = yield ratings_model_1.default.findAll({ where: { driver: userId } });
            let totalStars = 0;
            ratingDetails.forEach((rating) => {
                totalStars += Number(rating.stars);
            });
            const averageStars = ratingDetails.length > 0 ? (totalStars / ratingDetails.length).toFixed(1) : 0;
            return {
                message: constants_1.SuccessMsg.RATINGS.get,
                averageStars: averageStars,
                ratingCount: ratingCount,
            };
        });
    }
})();
//# sourceMappingURL=ratings.service.js.map