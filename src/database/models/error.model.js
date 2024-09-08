const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const errorSchema = new Schema({
  name_function: { type: String, required: true },
  parameter_function: { type: String, required: true },
  path: { type: String, required: true },
  error: { type: String, required: true },
});

module.exports = mongoose.model('error', errorSchema);
