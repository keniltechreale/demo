import express from 'express';
import AdminRoutes from './admin/index';
import UserRoutes from './users/index';

const router = express.Router();

router.use('/', UserRoutes);
router.use('/admin', AdminRoutes);

export default router;
