const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema(
  {
    name_test: { type: String, required: true },
    description_test: { type: String, required: true },
    type_test: { type: String, enum: ['MULTIPLE_CHOICE', 'TEKS', 'CODE', 'TRUE/FALSE'] },
    students: [
      {
        student_id: { type: Schema.Types.ObjectId, ref: 'user' },
        score: { type: Number },
        submitted_at: { type: Date },
        feedback: { type: String },
      },
    ],
    corrector: { type: Schema.Types.ObjectId, ref: 'user' },
    weight: { type: Number, required: true },
    parent_course: { type: Schema.Types.ObjectId, ref: 'course' },
    parent_module: { type: Schema.Types.ObjectId, ref: 'module' },
    parent_submodule: { type: Schema.Types.ObjectId, ref: 'submodule' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('test', testSchema);
