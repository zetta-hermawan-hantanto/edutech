const CourseModel = require('../../database/models/course.model');
const RateModel = require('../../database/models/rate.model');
const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');
const { ValidateCreateRate } = require('./rate.validator');
const { ValidateStudent } = require('../../utils/globalValidator/validateUser');

const CreateRate = async (parent, { input }, context) => {
  try {
    await ValidateStudent({ context });

    const { rate, content, parent_course } = input;

    await ValidateCreateRate({ rate, content, parent_course });

    const newRate = await RateModel.create({
      rate,
      content,
      author: user._id,
      parent_course,
    });

    if (!newRate) {
      throw new ApolloError('Error when create rate!');
    }

    await CourseModel.findByIdAndUpdate(newRate.parent_course, {
      $push: { rates: newRate._id },
    });

    return newRate;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'CreateRate',
      parameter_function: JSON.stringify(input),
      path: 'src/graphql/rate/rate.utilities.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  CreateRate,
};
