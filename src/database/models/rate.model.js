const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateSchema = new Schema(
  {
    rate: { type: Number, required: true },
    content: { type: String, required: true },
    author: { type: Schema.ObjectId, ref: 'user' },
    parent_course: { type: Schema.ObjectId, ref: 'course' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('rate', rateSchema);
