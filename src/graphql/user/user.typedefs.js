const { gql } = require('apollo-server-express');

const UserTypedef = gql`
  enum Role {
    STUDENT
    INSTRUCTOR
    ADMIN
    PARENT
    CONTENT_MANAGER
  }

  type User {
    _id: ID!
    name: String
    email: String
    password: String
    role: Role
    is_verified: Boolean
  }

  type ResultLogin {
    message: String
    token: String
  }

  type ResultRegister {
    message: String
    data: User
  }

  type Query {
    GetAllUsers: [User]
    GetUserById(id: ID!): User!
  }

  type Mutation {
    SignIn (input: InputSignIn!): ResultLogin!
    SignUp (input: InputSignUp!): ResultRegister!
  }

  input InputSignUp {
    name: String
    email: String
    password: String
    role: Role
  }

  input InputSignIn {
    email: String
    password: String
  }
`;

module.exports = UserTypedef;
