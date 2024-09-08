const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    if (!hashedPassword || !plainPassword) {
      throw new ApolloError('Password plain or hashed is required!');
    }

    const isMatched = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatched;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'VerifyPassword',
      parameter_function: JSON.stringify({ hashedPassword, plainPassword }),
      path: 'src/graphql/user/user.validator.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

const CreateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });

  return token;
};

const VerifyToken = (token) => {
  const id = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return null;
    }

    return decoded;
  });

  return id;
};

module.exports = {
  HashPassword,
  VerifyPassword,
  CreateToken,
  VerifyToken,
};
