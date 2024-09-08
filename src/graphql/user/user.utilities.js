const ErrorModel = require('../../database/models/error.model');
const UserModel = require('../../database/models/user.model');
const SENDING_EMAIL = require('../../utils/emails/email');
const { ApolloError } = require('apollo-server-express');
const { ValidateInputSignUp, ValidateInputSignIn } = require('./user.validator');
const { HashPassword, VerifyPassword, CreateToken } = require('./user.helper');

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

    const link = `http://localhost:4000/registrationConfirmation/${String(newUser._id)}`;
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

const SignIn = async (parent, { input }, context) => {
  try {
    const { email, password } = input;

    ValidateInputSignIn({ email, password });

    const userFound = await UserModel.findOne({
      email,
    });

    if (!userFound) {
      throw new ApolloError('Email or password is wrong!');
    }

    const isMatched = await VerifyPassword({ hashedPassword: userFound.password, plainPassword: password });

    if (!isMatched) {
      throw new ApolloError('Email or password is wrong!');
    }

    if (!userFound.is_verified) {
      throw new ApolloError('User is not verified, please verify the email!');
    }

    const token = CreateToken(String(userFound._id));

    const resultLogin = {
      message: 'Successfully login!',
      token,
    };

    return resultLogin;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'SignIn',
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
  SignIn,
};
