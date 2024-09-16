const { gql } = require('apollo-server-express');

const SubmoduleTypedef = gql`
  type Submodule {
    _id: ID
    title_submodule: String
    description_submodule: String
    video_material: [String]
    image_material: [String]
    document_material: [String]
    weight: Int
    tests: [Test]
    parent_course: Course
    parent_module: Module
  }

  type Mutation {
    CreateSubmodule(input: CreateSubmoduleInput): Submodule
  }

  input CreateSubmoduleInput {
    title_submodule: String
    description_submodule: String
    video_material: [String]
    image_material: [String]
    document_material: [String]
    weight: Int
    parent_course: ID
    parent_module: ID
  }
`;

module.exports = SubmoduleTypedef;
