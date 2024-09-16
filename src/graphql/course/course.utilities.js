const CourseModel = require('../../database/models/course.model');
const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');
const { ValidateInstructor } = require('../../utils/globalValidator/validateInstructor');
const { ValidateCreateCourse } = require('./course.validator');

const CreateCourse = async (parent, { input }, context) => {
  try {
    await ValidateInstructor({ context });

    const { title, description, category, level, tags } = input;

    await ValidateCreateCourse({ title, description, category, level, tags });

    const newCourseData = {
      title,
      description,
      category,
      level,
      instructor: context.user._id,
      modules: [],
      rates: [],
      likes: [],
      enrolledStudents: [],
      image: 'NOT FOUND',
      tags,
    };

    const newCourse = await CourseModel.create(newCourseData);

    if (!newCourse) {
      throw new ApolloError('Error when create course!');
    }

    return newCourse;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'CreateCourse',
      parameter_function: JSON.stringify({ input }),
      path: 'src/graphql/course/course.utilities.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

const UpdateCourse = async (parent, { input }, context) => {
  try {
    const { title, description, category, level, tags } = input;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'UpdateCourse',
      parameter_function: JSON.stringify(input),
      path: 'src/graphql/course.utilites.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

// const DeleteCourse = async (parent, { id }, context) => {
//   try {
//     if (!context.user) {
//       throw new ApolloError('You are not authenticated!');
//     }

//     if (context.user !== 'INSTRUCTOR' || context.user !== 'ADMIN') {
//       throw new ApolloError('You are not authorized');
//     }

//     if (!id) {
//       throw new ApolloError('ID is required!');
//     }

//     const course = await CourseModel.findById(id);

//     if (!course) {
//       throw new ApolloError('Course is not found');
//     }

//     const deletedCourse = await CourseModel.findByIdAndDelete(course._id);

//     const resultDeleteCourse = {
//       message: 'Successfully delete course!',
//       data: deletedCourse,
//     };

//   } catch (error) {
//     console.log(error);
//     await ErrorModel.create({
//       name_function: 'DeleteCourse',
//       parameter_function: JSON.stringify({ input }),
//       path: 'src/graphql/course/course.utilities.js',
//       error: JSON.stringify(error),
//     });
//     throw ApolloError(error.message);
//   }
// };

module.exports = {
  CreateCourse,
};
