const { GetAllUsers, GetUserById, SignUp, SignIn } = require('./user.utilities');

const UserResolver = {
  Query: {
    GetAllUsers,
    GetUserById,
  },
  Mutation: {
    SignUp,
    SignIn,
  },
};

module.exports = UserResolver;
