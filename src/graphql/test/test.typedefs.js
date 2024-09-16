const { gql } = require('apollo-server-express');

const TestTypedef = gql`
  enum TypeTest {
    MULTIPLE_CHOICE
    TEKS
    CODE
  }

  type Student {
    student_id: ID
    score: Int
    submitted_at: String
    feedback: String
  }

  type Test {
    _id: ID
    name_test: String
    description_test: String
    type_test: TypeTest
    students: [Student]
    corrector: User
    weight: Int
    parent_course: Course
    parent_module: Module
    parent_submodule: Submodule
  }

  type Mutation {
    CreateTest(input: CreateTestInput): Test
  }

  input CreateTestInput {
    name_test: String
    description_test: String
    type_test: TypeTest
    weight: Int
    parent_course: String
    parent_module: String
    parent_submodule: String
  }
`;

module.exports = TestTypedef;
