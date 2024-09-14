const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema(
  {
    title_module: { type: String, required: true },
    description_module: { type: String, required: true },
    submodules: [{ type: Schema.Types.ObjectId, ref: 'submodule' }],
    weight: { type: Number, required: true },
    parent_course: { type: Schema.Types.ObjectId, ref: 'course' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('module', moduleSchema);
