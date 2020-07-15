const Rental = require("../../models/rental");
const Booking = require("../../models/booking");
const { transformRental } = require("./merge");

module.exports = {
  getRentals: async (args, req) => {
    const query = args.city ? { city: args.city.toLowerCase() } : {};
    try {
      const rentals = await Rental.find(query).populate("image");
      return rentals.map((rental) => {
        return transformRental(rental);
      });
    } catch (error) {
      throw error;
    }
  },
  getUserRentals: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    try {
      const rentals = await Rental.find({ owner: user }).populate("image");
      return rentals.map((rental) => {
        return transformRental(rental);
      });
    } catch (error) {
      throw error;
    }
  },
  getRentalById: async (args, req) => {
    try {
      const rental = await Rental.findById(args.rentalId).populate("image");
      return transformRental(rental);
    } catch (error) {
      throw new Error("Rental not found!");
    }
  },
  verifyUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    const { rentalId } = args;
    try {
      const rental = await Rental.findById(rentalId).populate("owner");
      if (rental.owner.id !== user.id) {
        throw new Error("You are not owner of this rental!");
      }
      return { status: "verified" };
    } catch (error) {
      throw error;
    }
  },
  createRental: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    try {
      const rentalData = {
        ...args.createRentalInput,
        owner: user,
      };
      const createdRental = (await Rental.create(rentalData)).populate("owner");
      return transformRental(createdRental);
    } catch (error) {
      throw error;
    }
  },
  updateRental: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    const {
      rentalId,
      title,
      city,
      street,
      category,
      numOfRooms,
      description,
      dailyPrice,
      shared,
      image,
    } = args.updateRentalInput;
    try {
      const rental = await Rental.findById(rentalId).populate("owner");
      if (rental.owner.id !== user.id) {
        throw new Error("You are not owner of this rental!");
      }
      let rentalData = {};
      if (title) rentalData.title = title;
      if (city) rentalData.city = city;
      if (street) rentalData.street = street;
      if (category) rentalData.category = category;
      if (numOfRooms) rentalData.numOfRooms = numOfRooms;
      if (description) rentalData.description = description;
      if (shared) rentalData.shared = shared;
      if (dailyPrice) rentalData.dailyPrice = dailyPrice;
      if (image) rentalData.image = image;
      rental.set(rentalData);
      await rental.save();
      const updatedRental = await Rental.findById(rentalId)
        .populate("owner")
        .populate("image");
      return transformRental(updatedRental);
    } catch (error) {
      throw error;
    }
  },
  deleteRental: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const { user } = req;
    const { rentalId } = args;
    try {
      const rental = await Rental.findById(rentalId).populate("owner");
      if (rental.owner.id !== user.id) {
        throw new Error("You are not owner of this rental!");
      }
      const bookings = await Booking.find({ rental });
      if (bookings && bookings.length > 0) {
        throw new Error("Cannot delete rental with active booking!");
      }
      await rental.remove();
      return { status: "deleted" , id: rentalId  };
    } catch (error) {
      throw error;
    }
  },
};
