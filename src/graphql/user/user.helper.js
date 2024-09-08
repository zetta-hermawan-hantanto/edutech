const bcrypt = require('bcrypt');
const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');

const HashPassword = async (password) => {
  try {
    if (!password) {
      throw ApolloError('Password is required!');
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'HashPassword',
      parameter_function: JSON.stringify(password),
      path: 'src/graphql/user/user.validator.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

const VerifyPassword = async ({ hashedPassword, plainPassword }) => {
  try {
    if (!password) {
      throw ApolloError('Password is required!');
    }

    const isMatched = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatched;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'VerifyPassword',
      parameter_function: JSON.stringify(password),
      path: 'src/graphql/user/user.validator.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

const SendEmailRegistration = async () => {
  try {
    
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'SendEmailRegistration',
      parameter_function: JSON.stringify(),
      path: 'src/graphql/user/user.validator.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  HashPassword,
  VerifyPassword,
};
