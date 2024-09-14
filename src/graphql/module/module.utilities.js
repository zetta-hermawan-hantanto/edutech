const CourseModel = require('../../database/models/course.model');
const ErrorModel = require('../../database/models/error.model');
const ModuleModel = require('../../database/models/module.model');
const { ApolloError } = require('apollo-server-express');
const { ValidateCreateModuleParams, ValidateTitleModuleUnique, ValidateWeightModule } = require('./module.validator');

const CreateModule = async (parent, { input }, context) => {
  try {
    if (!context || !context.user || !context.user.role) {
      throw new ApolloError('You are not authenticated!');
    }

    if (context.user.role !== 'INSTRUCTOR') {
      throw new ApolloError('You are not authorized!');
    }

    const { title_module, description_module, weight, parent_course } = input;

    await ValidateCreateModuleParams({ title_module, description_module, weight, parent_course });

    if (!(await ValidateTitleModuleUnique({ title_module, parent_course }))) {
      throw new ApolloError('Title module is must be unique accross modules of the course!');
    }

    if (!(await ValidateWeightModule({ weight, parent_course })));

    const newModule = await ModuleModel.create({
      title_module,
      description_module,
      weight,
      parent_course,
    });

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
