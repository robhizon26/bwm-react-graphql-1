const Rental = require("../../models/rental");
const Booking = require("../../models/booking");
const moment = require("moment");
const { transformBooking } = require("./merge");

module.exports = {
  getBookings: async (args, req) => {
    const { rentalId } = args;
    try {
      const rental = await Rental.findById(rentalId); 
      let bookings = rental ?await Booking.find({ rental }) :await Booking.find({});
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  getReceivedBookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    try {
      const rentals = await Rental.find({ owner: user }, "_id");
      const rentalIds = rentals.map((r) => r.id);
      const bookings = await Booking.find({ rental: { $in: rentalIds } });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  getUserBookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    try {
      const bookings = await Booking.find({ user });
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      throw error;
    }
  },
  deleteBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    const DAYS_THRESHOLD = 3;
    const { bookingId } = args;
    try {
      const booking = await Booking.findById(bookingId).populate("user");
      if (booking.user.id !== user.id) {
        throw new Error("You are not owner of this booking!");
      }
      if (moment(booking.startAt).diff(moment(), "days") > DAYS_THRESHOLD) {
        await booking.remove();
        return { status: "deleted", id: bookingId  };
      } else {
        throw new Error(
          "You cannot delete booking at least 3 days before arrival!"
        );
      }
    } catch (error) {
      throw error;
    }
  },
  createBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    const bookingData = args.createBookingInput;
    try {
      const rental = await Rental.findById(bookingData.rentalId).populate("owner");;
      if (rental.owner.id === user.id) {
        throw new Error("Cannot create booking on your rental");
      }
      const booking = new Booking({ 
        ...bookingData,
        startAt: moment(bookingData.startAt).utc().format(),
        endAt: moment(bookingData.endAt).utc().format(),
        user:user.id,
        rental:bookingData.rentalId
      });
     
      if (!checkIfBookingDatesAreValid(booking)) {
        throw new Error("Dates are invalid!");
      }
      const rentalBookings = await Booking.find({ rental });
      const isBookingValid = checkIfBookingIsValid(booking, rentalBookings);
      if (isBookingValid) {
        const savedBooking = await booking.save();
        return transformBooking(savedBooking);
      } else {
        throw new Error("Choosen dates are already taken!");
      }
    } catch (error) {
      throw error;
    }
  },
};

function checkIfBookingDatesAreValid(booking) {
  let isValid = true;

  if (!booking.startAt || !booking.endAt) {
    isValid = false;
  }

  if (moment(booking.startAt) > moment(booking.endAt)) {
    isValid = false;
  }

  return isValid;
}

function checkIfBookingIsValid(pendingBooking, rentalBookings) {
  let isValid = true;
  if (rentalBookings && rentalBookings.length > 0) {
    isValid = rentalBookings.every((booking) => {
      const pendingStart = moment(pendingBooking.startAt);
      const pendingEnd = moment(pendingBooking.endAt);

      const bookingStart = moment(booking.startAt);
      const bookingEnd = moment(booking.endAt);

      return (
        (bookingStart < pendingStart && bookingEnd < pendingStart) ||
        (pendingEnd < bookingEnd && pendingEnd < bookingStart)
      );
    });
  }
  return isValid;
}
