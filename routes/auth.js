import express from 'express';
import { body } from 'express-validator';
import User from '../models/user.js';
import authController from '../controllers/auth.js';
const { signup, login } = authController;

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
    .notEmpty()
    .withMessage('Email cannot be empty!')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject('E-Mail address already exists!');
        }
      });
    })
    .normalizeEmail(),
      body('name')
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long'),
  ],signup
);

router.post('/login', 
   [
     body('email')
     .notEmpty()
     .withMessage('Email cannot be empty!') 
       .isEmail()
       .withMessage('Please enter a valid email.')
       .custom((value, { req }) => {
         return User.findOne({ email: value }).then(userDoc => {
           if (!userDoc) {
             return Promise.reject('Email not found!');
           }
         });
       })
       .normalizeEmail(),
     body('password')
       .notEmpty()
       .withMessage('Password is required')
   ],
  login
);

export default router;