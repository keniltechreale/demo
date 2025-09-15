"use strict";
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
exports.compareHash = exports.generateHash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
function generateHash(str) {
    return __awaiter(this, void 0, void 0, function* () {
        const bcryptSalt = bcrypt_1.default.genSaltSync(10);
        const strHash = yield bcrypt_1.default.hash(str, Number(bcryptSalt));
        return strHash.toString();
    });
}
exports.generateHash = generateHash;
function compareHash(str, hash) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(str, hash, function (err, isMatch) {
            if (err)
                return reject(err);
            resolve(isMatch);
        });
    });
}
exports.compareHash = compareHash;
//# sourceMappingURL=hash.utils.js.map