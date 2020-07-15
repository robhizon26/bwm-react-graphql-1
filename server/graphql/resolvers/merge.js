const DataLoader = require("dataloader");
const User = require("../../models/user");
const Rental = require("../../models/rental");
const moment = require("moment");

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const rentalLoader = new DataLoader((rentalIds) => {
  return Rental.find({ _id: { $in: rentalIds } });
});

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      password:null
    };
  } catch (err) {
    throw err;
  }
};

const rental = async (rentalId) => {
  try {
    const rental = await rentalLoader.load(rentalId.toString());
    return transformRental(rental);
  } catch (err) {
    throw err;
  }
};

const transformRental = (rental) => {
  return {
    ...rental._doc,
    _id: rental.id,
    owner: user.bind(this, rental._doc.owner),
    createdAt: moment(rental._doc.createdAt).utc().format() 
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    startAt: moment(booking.startAt).utc().format(),
    endAt: moment(booking.endAt).utc().format(),
    user: user.bind(this, booking._doc.user),
    rental: rental.bind(this, booking._doc.rental),
    createdAt: moment(booking._doc.createdAt).utc().format() 
  };
};

exports.transformBooking = transformBooking;
exports.transformRental = transformRental;
