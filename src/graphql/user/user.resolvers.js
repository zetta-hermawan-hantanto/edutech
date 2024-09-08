const { GetAllUsers, GetUserById, SignUp, SignIn } = require('./user.utilities');

const UserResolvers = {
  Query: {
    GetAllUsers,
    GetUserById,
  },
  Mutation: {
    SignUp,
    SignIn,
  },
};

module.exports = UserResolvers;
