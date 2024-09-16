const mongoose = require('mongoose');
const CourseModel = require('../../database/models/course.model');
const ModuleModel = require('../../database/models/module.model');
const SubmoduleModel = require('../../database/models/submodule.model');
const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');

const ValidateCreateTest = async ({ name_test, description_test, type_test, weight, parent_course, parent_module, parent_submodule }) => {
  try {
    if (!name_test || typeof name_test !== 'string') {
      throw new ApolloError('Name of test is required and must be string!');
    }

    if (!description_test || typeof description_test !== 'string') {
      throw new ApolloError('Description of test is required and must be string!');
    }

    const testTypes = ['MULTIPLE_CHOICE', ' TEKS', 'CODE'];

    if (!type_test || !testTypes.includes(type_test)) {
      throw new ApolloError('Type of test is required and must be MULTIPLE_CHOICE or TEKS or CODE or TRUE/FALSE');
    }

    if (typeof weight !== 'number') {
      throw new ApolloError('Weight of test is required and must be number!');
    }

    if (!parent_course || !mongoose.isValidObjectId(parent_course)) {
      throw new ApolloError('Parent course id of test is required and must be valid id mongoose!');
    }

    const course = await CourseModel.findById(parent_course).lean();

    if (!course) {
      throw new ApolloError('Parent course id is not valid, not found course!');
    }

    if (!parent_module || !mongoose.isValidObjectId(parent_module)) {
      throw new ApolloError('Parent module id of test is required and must be valid id mongoose');
    }

    const module = await ModuleModel.findById(parent_module).lean();

    if (!module) {
      throw new ApolloError('Parent module id is not valid, not found module!');
    }

    if (!parent_submodule || !mongoose.isValidObjectId(parent_submodule)) {
      throw new ApolloError('Parent submodule id of test is required and must be valid id mongoose');
    }

    const submodule = await SubmoduleModel.findById(parent_submodule).lean();

    if (!submodule) {
      throw new ApolloError('Parent submodule is not valid, not found submodule');
    }
  } catch (error) {
    consoe.log(error);
    await ErrorModel.create({
      name_function: 'ValidateCreateTest',
      parameter_function: JSON.stringify({
        name_test,
        description_test,
        type_test,
        weight,
        parent_course,
        parent_module,
        parent_submodule,
      }),
      path: 'src/graphql/test/test.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

const ValidateWeightTest = async ({ weight, parent_submodule }) => {
  try {
    if (!name_test || typeof name_test !== 'string') {
      throw new ApolloError('Name of test is required and must be string!');
    }

    if (!parent_submodule || !mongoose.isValidObjectId(parent_submodule)) {
      throw new ApolloError('Parent submodule id of test is required and must be valid id mongoose!');
    }

    const submodule = await SubmoduleModel.findById(parent_submodule).populate({ path: 'tests' }).lean();

    if (!submodule) {
      throw new ApolloError('Parent submodule id of test is not valid, not found submodule!');
    }

    const oldTests = submodule.tests ? submodule.tests : [];

    const isWeightValid = true;

    if (oldTests.length < 1) {
      return (isWeightValid = weight <= 100);
    }

    const totalWeight = oldTests.reduce((accumulator, test) => (accumulator += test.weight ? test.weight : 0), 0);

    return (isWeightValid = totalWeight + weight <= 100);
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateWeightTest',
      parameter_function: JSON.stringify({ weight, parent_submodule }),
      path: 'src/graphql/test/test.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

const ValidateUniqueTestName = async ({ name_test, parent_submodule }) => {
  try {
    if (!name_test || typeof name_test !== 'string') {
      throw new ApolloError('Name of test is required and must be string!');
    }

    if (!parent_submodule || !mongoose.isValidObjectId(parent_submodule)) {
      throw new ApolloError('Parent submodule id of test is required and must be valid id mongoose!');
    }

    const submodule = await SubmoduleModel.findById(parent_submodule).populate({ path: 'tests' }).lean();

    if (!submodule) {
      throw new ApolloError('Parent submodule id of test is not valid, not found submodule!');
    }

    const oldTests = submodule.tests ? submodule.tests : [];

    let isUniqueTestName = true;

    if (oldTests.length < 1) {
      return isUniqueTestName;
    }

    oldTests.forEach((oldTest) => {
      if (oldTest.name_test === name_test) {
        isUniqueTestName = false;
      }
    });

    return isUniqueTestName;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateUniqueTestName',
      parameter_function: JSON.stringify({ name_test, parent_submodule }),
      path: 'src/graphql/test/test.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  ValidateCreateTest,
  ValidateUniqueTestName,
  ValidateWeightTest,
};
