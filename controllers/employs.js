import Employs from '../models/employs.js';

const buildImageUrl = (baseUrl, imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/images/')) return baseUrl + imageUrl;
  return `${baseUrl}/images/${imageUrl}`;
};

const getEmploys = async (req, res, next) => {
  try {
    const result = await Employs.find();

    if (!result || result.length === 0) {
      const error = new Error('No barbers found');
      error.statusCode = 404;
      throw error;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const barbers = result.map(barber => ({
      id: barber._id,
      name: barber.name,
      imageUrl: buildImageUrl(baseUrl, barber.imageUrl)
    }));

    res.status(200).json({ barbers });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const getEmploysHome = async (req, res, next) => {
  try {
    const result = await Employs.find();

    if (!result || result.length === 0) {
      const error = new Error('No barbers found');
      error.statusCode = 404;
      throw error;
    }

    const baseUrl = process.env.NODE_ENV === 'production' ? `https://${req.get('host')}` : `http://${req.get('host')}`;
    
    const barbers = result.map(barber => ({
      id: barber._id,
      name: barber.name,
      imageUrl: buildImageUrl(baseUrl, barber.imageUrl)
    }));

    res.status(200).json({ barbers });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export default { getEmploys, getEmploysHome };
