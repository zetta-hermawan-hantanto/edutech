const validator = require('validator');
const { ApolloError } = require('apollo-server-express');

const ValidateInputSignUp = ({ name, email, password, role }) => {
  if (!name) {
    throw new ApolloError('Name is required!');
  }

  if (!email) {
    throw new ApolloError('Email is required!');
  }

  if (!password) {
    throw new ApolloError('Password is required!');
  }

  if (!role) {
    throw new ApolloError('Role is required!');
  }

  if (!validator.isEmail(email)) {
    throw new ApolloError('Email is not valid!');
  }

  if (!validator.isStrongPassword(password)) {
    throw new ApolloError('Password is not strong!');
  }

  const roles = ['STUDENT', 'INSTRUCTOR', 'ADMIN', 'PARENT', 'CONTENT_MANAGER'];

  if (!roles.includes(role)) {
    throw new ApolloError('Role is not valid!');
  }
};

const ValidateInputSignIn = ({ email, password }) => {
  if (!email) {
    throw new ApolloError('Email is required!');
  }

  if (!password) {
    throw new ApolloError('Password is required!');
  }

  if (!validator.isEmail(email)) {
    throw new ApolloError('Email is not valid!');
  }
};

module.exports = {
  ValidateInputSignUp,
  ValidateInputSignIn,
};
