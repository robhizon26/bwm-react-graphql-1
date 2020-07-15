const jwt = require('jsonwebtoken');
const config = require('../config/dev');
const User = require('../models/user');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  User.findById(decodedToken.sub, (error, foundUser) => {
    if (foundUser) {
      req.user = foundUser;
      req.isAuth = true;
    }
    next();
  })
};
