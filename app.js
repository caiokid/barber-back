import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Routes
import servicesRoutes from './routes/services.js';
import authRoutes from './routes/auth.js';
import employsRoutes from './routes/employs.js';
import userRoutes from './routes/user.js';
import commentRoutes from './routes/comments.js';
import timesRoutes from './routes/times.js';

const MongoDB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ 
  origin: function(origin, callback) {
    callback(null, origin)
  },
  credentials: true 
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/marcar', servicesRoutes);
app.use('/auth', authRoutes);
app.use('/employs', employsRoutes);
app.use('/marcado', userRoutes);
app.use('/comments', commentRoutes);
app.use('/times', timesRoutes);

// Middleware de erro genérico
app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';
  res.status(status).json({ message, data: error.data });
});

// Conexão MongoDB e inicialização
mongoose.connect(MongoDB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
