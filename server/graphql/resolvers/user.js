const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const config = require("../../config/dev");

module.exports = {
  login: async ({ email, password }) => {
    if (!password || !email) {
      throw new Error("Email or password is missing!");
    }
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      throw new Error("User with provided email doesn't exists");
    }
    if (foundUser.hasSamePassword(password)) {
      const token = jwt.sign(
        {
          sub: foundUser.id,
          username: foundUser.username,
        },
        config.JWT_SECRET,
        { expiresIn: "2h" }
      );
      return { userId: foundUser.id, token: token, tokenExpiration: 2 };
    } else {
      throw new Error("User with provided email doesnt exists");
    }
  },
  register: async (args) => {
    try {
      const {
        username,
        email,
        password,
        passwordConfirmation,
      } = args.userInput;
      if (!password || !email) {
        throw new Error("Email or password is missing!");
      }
      if (password !== passwordConfirmation) {
        throw new Error("Password is not maching confirmation password!");
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User with provided email already exists!");
      }
      const user = new User({ username, email, password });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
};
