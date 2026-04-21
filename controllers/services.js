import Services from '../models/services.js';
import Time from '../models/times.js';


const getServices = async (req, res, next) => {
  try {
    const result = await Services.find();

    if (!result || result.length === 0) {
      const error = new Error('Not found');
      error.statusCode = 404;
      throw error;
    }

    const services = result.map(s => ({
      id: s._id,
      nome: s.jobName,
      preco: s.price,
      desc: s.desc,
      duration: s.duration
    }));

    res.status(200).json({ armazena: services });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const getServicesMark = async (req, res, next) => {
  try {
    const { service } = req.params;

    const result = await Services.findById(service);

    if (!result) {
      const error = new Error('Not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      jobs: [{
        id: result._id,
        nome: result.jobName,
        preco: result.price,
        desc: result.desc,
        duration: result.duration
      }]
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const getServicesHome = async (_req, res, next) => {
  try {
    const result = await Services.find();

    if (!result || result.length === 0) {
      const error = new Error('Not found');
      error.statusCode = 404;
      throw error;
    }

    const services = result.map(s => ({
      id: s._id,
      nome: s.jobName,
      preco: s.price,
      desc: s.desc,
      duration: s.duration
    }));

    res.status(200).json({ jobs: services });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export default {getServices, getServicesMark, getServicesHome };
