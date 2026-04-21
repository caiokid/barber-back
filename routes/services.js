import express from 'express';
import isAuth from '../middleware/is-auth.js';
import servicesController from '../controllers/services.js';

const { getServices, getServicesHome, getServicesMark } = servicesController;
const router = express.Router();

router.get('/services/home', getServicesHome);
router.get('/services/:service', isAuth, getServicesMark);
router.get('/service/:funcId', isAuth, getServices);

export default router;
