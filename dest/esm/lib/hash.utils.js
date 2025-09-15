var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
export function generateHash(str) {
    return __awaiter(this, void 0, void 0, function* () {
        const bcryptSalt = bcrypt.genSaltSync(10);
        const strHash = yield bcrypt.hash(str, Number(bcryptSalt));
        return strHash.toString();
    });
}
export function compareHash(str, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(str, hash, function (err, isMatch) {
            if (err)
                return reject(err);
            resolve(isMatch);
        });
    });
}
//# sourceMappingURL=hash.utils.js.map