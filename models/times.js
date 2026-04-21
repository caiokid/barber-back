import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  month: {
    type: String,
    required: true
  },
  monthIndex: {
    type: Number,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employs',
    required: true
  }
}, { timestamps: true });

const Times = mongoose.model('Times', postSchema);
export default Times;
