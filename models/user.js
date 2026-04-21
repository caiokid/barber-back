import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({

  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  scheduledAppointments: {
    items: [{
      timeId: {
        type: Object,
        required: true
      },
      month: {
        type: String,
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
        type: Object,
        required: true
      },
      barberName: {
        type: String,
        required: true
      },
      serviceId: {
        type: String,
        required: true
      },
      jobName: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      }
    }]
  },

  comments: {
    items: [{
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }

}, { timestamps: true });

const User = mongoose.model('User', postSchema);
export default User;
