const ErrorModel = require('../../database/models/error.model');
const UserModel = require('../../database/models/user.model');
const SENDING_EMAIL = require('../../utils/emails/email');
const { ApolloError } = require('apollo-server-express');
const { ValidateInputSignUp } = require('./user.validator');
const { HashPassword, VerifyPassword } = require('./user.helper');

// Query User
const GetAllUsers = () => {
  return [];
};

const GetUserById = () => {
  return {};
};

// Mutation User
const SignUp = async (parent, { input }, context) => {
  try {
    const { name, email, password, role } = input;

    ValidateInputSignUp({ name, email, password, role });

    const isEmailAvailable = await UserModel.findOne({
      email,
    });

    if (isEmailAvailable) {
      throw ApolloError('Email have been used by other people!');
    }

    const hashedPassword = await HashPassword(password);

    const newUserData = {
      name,
      email,
      password: hashedPassword,
      role,
    };

    const newUser = await UserModel.create(newUserData);

    const link = `http://localhost:4000/registrationConfirmation/${newUser._id}`;
    await SENDING_EMAIL.REGISTRATION({ name: newUser.name, email: newUser.email, link });

    const resultSignUp = {
      message: 'Successfully create user and please check email inbox to verify the email!',
      data: newUser,
    };

    return resultSignUp;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'SignUp',
      parameter_function: JSON.stringify(input),
      path: 'src/graphql/user/user.utilities.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  GetAllUsers,
  GetUserById,
  SignUp,
};
