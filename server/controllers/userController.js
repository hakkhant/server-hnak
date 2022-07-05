const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  if (err.message === 'incorrect email') {
    errors.email = 'that email is not registered';
  }
  if (err.message === 'incorrect password') {
    errors.password = 'that password is incorrect';
  }
  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// Login Route
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // Token Create
    const token = createToken(user._id, user.username);
    // Cookie
    res.status(201).json({ user: user.username, token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// Register Route
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (!exists) {
      const user = await User.create({ username, email, password });
      // Create Token
      const token = createToken(user._id, user.username);
      res.status(201).json({
        user: user.username,
        token,
      });
    } else {
      const errors = { email: 'that email is already registered' };
      res.status(400).json({ errors });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const userController = {
  login,
  register,
};

module.exports = userController;
