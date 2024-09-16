const TestModel = require('../../database/models/test.model');
const SubmoduleModel = require('../../database/models/submodule.model');
const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');
const { ValidateInstructor } = require('../../utils/globalValidator/validateUser');
const { ValidateCreateTest, ValidateWeightTest, ValidateUniqueTestName } = require('./test.validator');

const CreateTest = async (parent, { input }, context) => {
  try {
    await ValidateInstructor({ context });

    const { name_test, description_test, type_test, weight, parent_course, parent_module, parent_submodule } = input;

    await ValidateCreateTest({ name_test, description_test, type_test, weight, parent_course, parent_module, parent_submodule });

    if (!(await ValidateWeightTest({ weight, parent_submodule }))) {
      throw new ApolloError('Total weight old test + new weight of test must not be greather than 100');
    }

    if (!(await ValidateUniqueTestName({ name_test, parent_submodule }))) {
      throw new ApolloError('Name of test is must be unique!');
    }

    const newTest = await TestModel.create({
      name_test,
      description_test,
      type_test,
      students: [],
      corrector: context.user._id,
      weight,
      parent_course,
      parent_module,
      parent_submodule,
    });

    if (!newTest) {
      throw new ApolloError('Error when create test!');
    }

    await SubmoduleModel.findByIdAndUpdate(newTest.parent_submodule, {
      $push: { tests: newTest._id },
    });

    return newTest;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'CreateTest',
      parameter_function: JSON.stringify(input),
      path: 'src/graphql/test/test.utilities.js',
      error: String(ErrorEvent),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  CreateTest,
};
