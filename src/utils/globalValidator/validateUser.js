const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');

const ValidateInstructor = async ({ context }) => {
  try {
    if (!context || !context.user || !context.user.role) {
      throw new ApolloError('You are not authenticated!');
    }

    if (context.user.role !== 'INSTRUCTOR') {
      throw new ApolloError('You are not authorized!');
    }
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateInstructor',
      parameter_function: JSON.stringify({ context }),
      path: 'src/utils/globalValidator/validateUser.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

const ValidateStudent = async ({ context }) => {
  try {
    if (!context || !context.user || !context.user.role) {
      throw new ApolloError('You are not authenticated!');
    }

    if (context.user.role !== 'STUDENT') {
      throw new ApolloError('You are not authorized!');
    }
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateStudent',
      parameter_function: JSON.stringify({ context }),
      path: 'src/utils/globalValidator/validateUser.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  ValidateInstructor,
  ValidateStudent
};
