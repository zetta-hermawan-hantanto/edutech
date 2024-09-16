const CourseModel = require('../../database/models/course.model');
const ErrorModel = require('../../database/models/error.model');
const ModuleModel = require('../../database/models/module.model');
const { ApolloError } = require('apollo-server-express');
const { ValidateCreateModuleParams, ValidateTitleModuleUnique, ValidateWeightModule } = require('./module.validator');
const { ValidateInstructor } = require('../../utils/globalValidator/validateInstructor');

const CreateModule = async (parent, { input }, context) => {
  try {
    await ValidateInstructor({ context });

    const { title_module, description_module, weight, parent_course } = input;

    await ValidateCreateModuleParams({ title_module, description_module, weight, parent_course });

    if (!(await ValidateTitleModuleUnique({ title_module, parent_course }))) {
      throw new ApolloError('Title module is must be unique accross modules of the course!');
    }

    if (!(await ValidateWeightModule({ weight, parent_course }))) {
      throw new ApolloError('Weight modules is not valid, total of weight modules in this course must not greather than 100');
    }

    const newModule = await ModuleModel.create({
      title_module,
      description_module,
      submodules: [],
      weight,
      parent_course,
    });

    if (!newModule) {
      throw new ApolloError('Error when create module!');
    }

    await CourseModel.findByIdAndUpdate(newModule.parent_course, {
      $push: { modules: newModule._id },
    });

    return newModule;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'CreateModule',
      parameter_function: JSON.stringify(input),
      path: 'src/graphql/module/module.utilities.js',
      error: JSON.stringify(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  CreateModule,
};
