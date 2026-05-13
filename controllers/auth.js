import crypto from 'crypto';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validação falhou');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, name, password } = req.body;

    if(password.length < 5) {
      const error = new Error('A senha deve ter pelo menos 5 caracteres.');
      error.data = errors.array();
      error.statusCode = 422;
      throw error;
    }

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
      const error = new Error('Validação falhou');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('E-mail não encontrado.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Senha incorreta.');
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
      message: 'Logado com sucesso!',
      userId: user._id.toString()
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validação falhou');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findOne({ email });

    // Sempre retorna 200 para não revelar se o email existe
    if (!user) {
      return res.status(200).json({ message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetToken = hashedToken;
    user.resetTokenExpira = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Recuperação de senha',
      html: `
        <p>Olá, ${user.name}!</p>
        <p>Clique no link abaixo para redefinir sua senha. O link expira em 1 hora.</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `
    });

    res.status(200).json({ message: 'Se este e-mail estiver cadastrado, você receberá as instruções em breve.' });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validação falhou');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpira: { $gt: Date.now() }
    });

    if (!user) {
      const error = new Error('Token inválido ou expirado.');
      error.statusCode = 400;
      throw error;
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpira = undefined;
    await user.save();

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export default { signup, login, forgotPassword, resetPassword };
