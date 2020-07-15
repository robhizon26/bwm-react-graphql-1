const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    startAt: String!
    endAt: String!
    price: Float!
    nights: Int!
    guests: Int!
    user: User!
    rental: Rental!
    createdAt: String!
}

type Rental {
  _id: ID!
  title: String!
  city: String!
  street: String!
  category: String!
  numOfRooms: Int!
  description: String!
  dailyPrice: Float!
  shared: Boolean
  image: CloudinaryImage 
  owner: User!
  createdAt: String!
}

type User {
  _id: ID!
  username: String!
  email: String!
  password: String
}

type CloudinaryImage {
  _id: ID!
  url: String!
  cloudinaryId: String!
  createdAt: String!
}

 
type Status {
  status: String
  id: String
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input UserInput {
  username: String!
  email: String!
  password: String!
  passwordConfirmation: String!
}

input CreateRentalInput {
  title: String!
  city: String!
  street: String!
  category: String!
  numOfRooms: Int!
  description: String!
  dailyPrice: Float!
  shared: Boolean
  image: String!
}

input UpdateRentalInput {
  rentalId:String!
  title: String
  city: String
  street: String
  category: String
  numOfRooms: Int
  description: String
  dailyPrice: Float
  shared: Boolean
  image: String
}

input CreateBookingInput {
  startAt: String!
  endAt: String!
  price: Float!
  nights: Int!
  guests: Int!
  rentalId: String!
}

type RootQuery {
  getRentals(city:String):[Rental!]!
  getUserRentals:[Rental!]!
  login(email: String!, password: String!): AuthData!
  getRentalById(rentalId:String):Rental!
  verifyUser(rentalId:String!):Status
  getBookings(rentalId:String):[Booking!]!
  getReceivedBookings:[Booking!]!
  getUserBookings:[Booking!]!
}
type RootMutation {
  register(userInput: UserInput): User
  createRental(createRentalInput:CreateRentalInput):Rental!
  updateRental(updateRentalInput:UpdateRentalInput):Rental!
  deleteRental(rentalId:String!):Status
  deleteBooking(bookingId:String!):Status
  createBooking(createBookingInput:CreateBookingInput):Booking!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
