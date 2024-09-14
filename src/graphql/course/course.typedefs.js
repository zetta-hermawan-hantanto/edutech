const { gql } = require('apollo-server-express');

const CourseTypedef = gql`
  enum Level {
    BASIC
    INTERMEDIATE
    ADVANCED
  }

  type Course {
    _id: ID
    title: String
    description: String
    category: [String!]
    level: Level
    instructor: User
    modules: [Module]
    rates: Int
    likes: Int
    enrolledStudents: [User]
    image: String
    tags: [String!]
  }

  type Mutation {
    CreateCourse(input: CreateCourseInput): Course
  }

  input CreateCourseInput {
    title: String
    description: String
    category: [String!]!
    level: Level
    image: String
    tags: [String!] 
  }
`;

module.exports = CourseTypedef;
