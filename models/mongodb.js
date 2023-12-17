const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_name: String,
  email: String,
  password: String,
});

// Create the model for the user schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = {
  User: User,
};
