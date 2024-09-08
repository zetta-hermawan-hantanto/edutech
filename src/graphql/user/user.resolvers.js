const { GetAllUsers, GetUserById, SignUp } = require('./user.utilities');

const UserResolvers = {
  Query: {
    GetAllUsers,
    GetUserById,
  },
  Mutation: {
    SignUp,
  },
};

module.exports = UserResolvers;
