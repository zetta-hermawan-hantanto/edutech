const mongoose = require('mongoose');
const ErrorModel = require('../../database/models/error.model');
const CourseModel = require('../../database/models/course.model');
const { ApolloError } = require('apollo-server-express');

const ValidateCreateModuleParams = async ({ title_module, description_module, weight, parent_course }) => {
  try {
    if (!title_module || typeof title_module !== 'string') {
      throw new ApolloError('Title module is required and must be string!');
    }

    if (!description_module || typeof description_module !== 'string') {
      throw new ApolloError('Description module is required and must be string!');
    }

    if (typeof weight !== 'number') {
      throw new ApolloError('Weight must be number');
    }

    if (!parent_course || !mongoose.isValidObjectId(parent_course)) {
      throw new ApolloError('Parent course is required and must be valid id mongoose!');
    }

    const course = await CourseModel.findById(parent_course).populate({ path: 'modules' }).lean();

    if (!course) {
      throw new ApolloError('Parent course id is no longer valid, since there are not course matched with the id');
    }
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateCreateModuleParams',
      parameter_function: JSON.stringify({ title_module, description_module, weight, parent_course }),
      path: 'src/graphql/module/module.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

const ValidateTitleModuleUnique = async ({ title_module, parent_course }) => {
  try {
    if (!title_module || typeof title_module !== 'string') {
      throw new ApolloError('Title module is required and must be string!');
    }

    if (!parent_course || !mongoose.isValidObjectId(parent_course)) {
      throw new ApolloError('Parent course is required and must be valid id mongoose!');
    }

    const course = await CourseModel.findById(parent_course).populate({ path: 'modules' }).lean();

    if (!course) {
      throw new ApolloError('Parent course id is no longer valid, since there are not course matched with the id');
    }

    const oldModules = course.modules ? course.modules : [];

    if (!oldModules || oldModules.length < 1) {
      return;
    }

    let isUnique = true;

    oldModules.forEach((oldModule) => {
      if (oldModule.title_module && oldModule.title_module === title_module) {
        isUnique = false;
      }
    });

    return isUnique;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateTitleModuleUnique',
      parameter_function: JSON.stringify({ title_module, parent_course }),
      path: 'src/graphql/module/module.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

const ValidateWeightModule = async ({ weight, parent_course }) => {
  try {
    if (typeof weight !== 'number') {
      throw new ApolloError('Weight is required and must be number!');
    }

    if (!parent_course || !mongoose.isValidObjectId(parent_course)) {
      throw new ApolloError('Parent course is required and must be valid id mongoose!');
    }

    const course = await CourseModel.findById(parent_course).populate({ path: 'modules' }).lean();

    if (!course) {
      throw new ApolloError('Parent course id is no longer valid, since there are not course matched with the id');
    }

    const oldModules = course.modules ? course.modules : [];

    let isWeightValid;

    if (oldModules.length < 1) {
      return (isWeightValid = weight <= 100);
    }

    const totalWeight = oldModules.reduce((accumulator, oldModule) => (accumulator += oldModule.weight ? oldModule.weight : 0), 0);

    return (isWeightValid = weight + totalWeight <= 100);
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateWeightModule',
      parameter_function: JSON.stringify({ weight, parent_course }),
      path: 'src/graphql/module/module.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  ValidateCreateModuleParams,
  ValidateTitleModuleUnique,
  ValidateWeightModule,
};
