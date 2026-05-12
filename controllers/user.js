import User from '../models/user.js';
import Employs from '../models/employs.js';
import Services from '../models/services.js';
import Times from '../models/times.js';
import Comment from '../models/comments.js';

const calcEndTime = (startTime, duration) => {
  const [h, m] = startTime.split(':').map(Number);
  const durationMin = parseInt(duration);
  const totalMin = h * 60 + m + durationMin;
  const endH = Math.floor(totalMin / 60) % 24;
  const endM = totalMin % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

const MarcarHorário = async (req, res, next) => {
  try {
    const { funcId, serviçoId, clock, mesExato } = req.body;

    const [employ, service, user] = await Promise.all([
      Employs.findById(funcId),
      Services.findById(serviçoId),
      User.findById(req.userId)
    ]);

    if (!employ || !service || !user) {
      const error = new Error('Data not found');
      error.statusCode = 404;
      throw error;
    }

    const startTime = clock;
    const endTime = calcEndTime(clock, service.duration);

    const times = await Times.create({
      month: mesExato,
      monthIndex: 1,
      startTime,
      endTime,
      barberId: employ._id
    });

    await times.save();

    user.scheduledAppointments.items.push({
      timeId: times._id,
      month: times.month,
      startTime: times.startTime,
      endTime: times.endTime,
      barberId: employ._id,
      barberName: employ.name,
      serviceId: service._id,
      jobName: service.jobName,
      price: service.price
    });

    await user.save();

    res.status(201).json({
      message: 'Appointment scheduled successfully!',
      startTime,
      endTime,
      service: service.jobName,
      duration: service.duration
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const Marcadosy = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.userId);

    if (user) {
      res.status(200).json({
        name: user.name,
        appointments: user.scheduledAppointments.items
      });
    } else {
      res.status(200).json({ message: 'No appointments scheduled yet.' });
    }

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const AdicionarComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      const error = new Error('Comment cannot be empty.');
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
 
    if(user.comments.items.length < 0){
      user.comments.items.push({ text: text.trim() });
    }else{
      user.comments.items.pop();
      user.comments.items.push({ text: text.trim() });
    } 

    await user.save();
    
    const lastComment = await Comment.findOneAndDelete({}).sort({ _id: -1 });

    const comment = await Comment.create({text: text.trim(), author: user.name, userId: user._id});

    await comment.save();


    res.status(201).json({
      message: 'Comment added!',
      comment: {
        id: comment._id,
        text: comment.text,
        author: user.name,
        createdAt: comment.createdAt
      }
    });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

const Deletar = async (req, res, next) => {
  const { idarray } = req.body;
  try {
    const user = await User.findById(req.userId);

    const item = user.scheduledAppointments.items.find(
      item => item._id.toString() === idarray
    );

    if (item) {
      await Times.findByIdAndDelete(item.timeId);
    }

    user.scheduledAppointments.items = user.scheduledAppointments.items.filter(
      item => item._id.toString() !== idarray
    );

    await user.save();

    res.status(200).json({ ok: 1 });

  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export default { MarcarHorário, Marcadosy, AdicionarComment, Deletar };
