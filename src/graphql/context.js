const ErrorModel = require('../database/models/error.model');
const UserModel = require('../database/models/user.model');
const { VerifyToken } = require('./user/user.helper');
const { ApolloError } = require('apollo-server-express');

const context = async ({ req }) => {
  try {
    const { authorization } = req.headers;
    let userFound = null;

    if (authorization) {
      const token = authorization.split(' ')[1];
      const { id } = VerifyToken(token);

      if (id) {
        userFound = await UserModel.findById(id);
      }
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
