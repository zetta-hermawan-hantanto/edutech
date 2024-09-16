const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submoduleSchema = new Schema(
  {
    title_submodule: { type: String, required: true },
    description_submodule: { type: String, required: true },
    video_material: [{ type: String }],
    image_material: [{ type: String }],
    document_material: [{ type: String }],
    weight: { type: Number, required: true },
    tests: [{ type: Schema.Types.ObjectId, ref: 'test' }],
    parent_course: { type: Schema.Types.ObjectId, ref: 'course' },
    parent_module: { type: Schema.Types.ObjectId, ref: 'module' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('submodule', submoduleSchema);
