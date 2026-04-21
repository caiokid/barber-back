import express from 'express';
import userController from '../controllers/user.js';
import isAuth from '../middleware/is-auth.js';

const  {MarcarHorário, Marcadosy, Deletar, AdicionarComment}  = userController;

const router = express.Router();

router.post('/horario', isAuth, MarcarHorário);
router.get('/confirmed', isAuth, Marcadosy);
router.post('/deletar', isAuth, Deletar);
router.post('/comment', isAuth, AdicionarComment);

export default router;
