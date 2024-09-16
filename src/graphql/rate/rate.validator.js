const mongoose = require('mongoose');
const CourseModel = require('../../database/models/course.model');
const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');

const ValidateCreateRate = async ({ rate, content, parent_course }) => {
  try {
    if (typeof rate !== 'number') {
      throw new ApolloError('Rate is required and must be number');
    }

    if (rate <= 0 && rate > 5) {
      throw new ApolloError('Rate must be range 1-5');
    }

    if (!content || typeof content !== 'content') {
      throw new ApolloError('Content is required and must be string!');
    }

    if (!parent_course || !mongoose.isValidObjectId(parent_course)) {
      throw new ApolloError('Parent course id is required and must be valid id mongoose!');
    }

    const course = await CourseModel.findById(parent_course);

    if (!course) {
      throw new ApolloError('Parent course id is not valid, not found course!');
    }
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'CreateRateValidate',
      parameter_function: JSON.stringify({ rate, content, parent_course }),
      path: '/src/graphql/rate/rate.validator.js',
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  ValidateCreateRate,
};
