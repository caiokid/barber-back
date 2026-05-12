import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, name, password } = req.body;

    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({ email, password: hashedPw, name });
    const result = await user.save();

    res.status(201).json({
      message: 'Usuário criado!',
      userId: result._id,
      user: { email: result.email, name: result.name }
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('E-mail não encontrado! Por favor, verifique suas credenciais.');
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Senha incorreta!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login successful!',
      userId: user._id.toString()
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export default { signup, login };
