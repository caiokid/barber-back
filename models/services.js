import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  jobName: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Services = mongoose.model('Services', postSchema);
export default Services;