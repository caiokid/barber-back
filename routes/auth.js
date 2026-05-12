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
    .withMessage('O email não pode ser vazio!')
    .isEmail()
    .withMessage('Por favor, insira um email válido.')
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
      .withMessage("Nome não pode ser vazio!"),
    body('password')
      .trim()
      .isLength({ min: 5 })
      .withMessage('A senha deve conter no mínimo 5 caracteres!'),
  ],signup
);

router.post('/login', 
   [
     body('email')
     .notEmpty()
     .withMessage('O email não pode ser vazio!') 
       .isEmail()
       .withMessage('Por favor, insira um email válido.')
       .custom((value, { req }) => {
         return User.findOne({ email: value }).then(userDoc => {
           if (!userDoc) {
             return Promise.reject('E-mail não encontrado! Por favor, verifique suas credenciais.');
           }
         });
       })
       .normalizeEmail(),
     body('password')
       .notEmpty()
       .withMessage('A senha é obrigatória!')
   ],
  login
);

export default router;