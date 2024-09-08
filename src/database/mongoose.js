const mongoose = require('mongoose');
const { ApolloError } = require('apollo-server-express');

let connection;

const createConnection = async () => {
  try {
    if (connection) {
      console.log('Successfully connected to database');
      return;
    }

    connection = await mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Successfully connected to database');
  } catch (error) {
    console.log('Failure when connecting to databases - error: ', error);
    throw ApolloError(error.message);
  }
};

module.exports = createConnection;
