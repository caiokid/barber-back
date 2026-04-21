import Times from '../models/times.js';



const checkTimes = async (req, res, next) => {
  try {
    const occupied = await Times.find();

    const slots = occupied.map(item => ({
      month: item.month,
      startTime: item.startTime,
      endTime: item.endTime,
      barberId: item.barberId
    }));

    console.log('Horários ocupados:', slots);
     
    res.status(200).json(slots);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export default { checkTimes};