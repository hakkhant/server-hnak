const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username cannot be empty'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'email cannot be empty'],
    },
    password: {
      type: String,
      required: [true, 'Password cannot be empty'],
    },
  },
  { timestamps: true }
);
// fire a function before doc saved to database
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Incorrect password...');
  }
  throw Error('Incorrect email...');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
