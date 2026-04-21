import express from 'express';
import employsController from '../controllers/employs.js';
import isAuth from '../middleware/is-auth.js';

const { getEmploys, getEmploysHome } = employsController;
const router = express.Router();

router.get('/barbers', isAuth, getEmploys);
router.get('/barbers/home', getEmploysHome);

export default router;
