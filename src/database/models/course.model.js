const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: [{ type: String, required: true }],
    level: { type: String, enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED'], required: true },
    instructor: { type: Schema.Types.ObjectId, required: true },
    modules: [{ type: Schema.Types.ObjectId, ref: 'module' }],
    rates: [{ type: Schema.Types.ObjectId, ref: 'rate' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    image: { type: String },
    tags: [{ type: String, ref: 'tag' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('course', courseSchema);
