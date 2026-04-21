import express from 'express';
import timesController from '../controllers/times.js';
import isAuth from '../middleware/is-auth.js';

const  { checkTimes }  = timesController;

const router = express.Router();


router.get('/check', isAuth, checkTimes);

export default router;