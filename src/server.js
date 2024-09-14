const express = require('express');
const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers');
const dotenv = require('dotenv');
const createConnection = require('./database/mongoose');
const authRoute = require('./routes/authRoute');
const context = require('./graphql/context');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// To be able access the env
dotenv.config();

// Connect to databases
createConnection();

// Schema for graphql
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

const server = new ApolloServer({ schema, context });

// Start the server
async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(authRoute);

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();
