import express from 'express';
import { body } from 'express-validator';
import {getComments} from '../controllers/comment.js';

const router = express.Router();


router.get('/show', getComments);

export default router;