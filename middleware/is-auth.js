import { error } from 'console';
import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    res.status(401).json({error: 'Not authenticated.'});
    return next(error);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};

export default isAuth;
