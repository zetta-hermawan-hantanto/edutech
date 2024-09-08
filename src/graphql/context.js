const ErrorModel = require('../database/models/error.model');
const UserModel = require('../database/models/user.model');
const { VerifyToken } = require('./user/user.helper');
const { ApolloError } = require('apollo-server-express');

const context = async ({ req }) => {
  try {
    const { authorization } = req.headers;
    let userFound = null;

    const userId = VerifyToken(token);

    if (userId !== null) {
      userFound = await UserModel.findById(userId);
    }

    return {
      user: userFound,
    };
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'context',
      parameter_function: JSON.stringify({ req }),
      path: 'src/graphql/context.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = context;
