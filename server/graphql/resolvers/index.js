const rentalResolver = require('./rental');
const userResolver = require('./user');
const bookingResolver = require('./booking');

module.exports ={
  ...rentalResolver,
  ...bookingResolver,
  ...userResolver
};

