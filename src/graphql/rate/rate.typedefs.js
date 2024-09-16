const { gql } = require('apollo-server-express');

const RateTypedef = gql`
  type Rate {
    _id: ID
    rate: Int
    content: String
    author: User
    parent_course: Course
  }

  type Mutation {
    CreateRate(input: CreateRateInput): Rate
  }

  input CreateRateInput {
    rate: Int
    content: String
    parent_course: ID
  }
`;

module.exports = RateTypedef;
