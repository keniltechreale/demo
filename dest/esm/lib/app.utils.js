var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AdminUser from '../models/admin.model';
import logger from './logger';
export default new (class AppUtils {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield AdminUser.findOne({
                where: { email: 'admin@piupiu.com' },
            });
            if (!adminUser || adminUser == null) {
                yield AdminUser.create({
                    id: 1,
                    name: 'admin',
                    email: 'admin@piupiu.com',
                    password: 'Admin@123',
                });
                logger.info('Admin User Created');
            }
            logger.info('App data initialized');
        });
    }
})();
//# sourceMappingURL=app.utils.js.map