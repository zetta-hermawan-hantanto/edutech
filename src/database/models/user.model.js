const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN', 'PARENT', 'CONTENT_MANAGER'], required: true },
  is_verified: { type: Boolean, default: false, required: true },
});

module.exports = mongoose.model('user', userSchema);
