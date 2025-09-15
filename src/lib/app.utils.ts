import AdminUser, { IAdminUser } from '../models/admin.model';
import logger from './logger';

export default new (class AppUtils {
  async init(): Promise<void> {
    const adminUser: IAdminUser = await AdminUser.findOne({
      where: { email: 'admin@piupiu.com' },
    });

    if (!adminUser || adminUser == null) {
      await AdminUser.create({
        id: 1,
        name: 'admin',
        email: 'admin@piupiu.com',
        password: 'Admin@123',
      });
      logger.info('Admin User Created');
    }
    logger.info('App data initialized');
  }
})();
