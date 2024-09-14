const { gql } = require('apollo-server-express');

const ModuleTypedef = gql`
  type Module {
    _id: ID
    title_module: String
    description_module: String
    submodules: [Submodule]
    weight: Int
    parent_course: Course
  }

  type Mutation {
    CreateModule(input: CreateModuleInput): Module
  }

  input CreateModuleInput {
    title_module: String
    description_module: String
    weight: Int
    parent_course: ID
  }
`;

module.exports = ModuleTypedef;
