const { ApolloError } = require('apollo-server-express');
const CourseModel = require('../../database/models/course.model');
const ErrorModel = require('../../database/models/error.model');
const ModuleModel = require('../../database/models/module.model');
const mongoose = require('mongoose');

const ValidateCreateSubmodule = async ({
  title_submodule,
  description_submodule,
  video_material,
  image_material,
  document_material,
  weight,
  parent_course,
  parent_module,
}) => {
  try {
    if (!title_submodule || typeof title_submodule !== 'string') {
      throw new ApolloError('Title submodule is required and must be string!');
    }

    if (!description_submodule || typeof description_submodule !== 'string') {
      throw new ApolloError('Description submodule is required and must be string!');
    }

    if (!Array.isArray(video_material)) {
      throw new ApolloError('Type of video material must be array!');
    }

    if (!Array.isArray(image_material)) {
      throw new ApolloError('Type of image material must be array!');
    }

    if (!Array.isArray(document_material)) {
      throw new ApolloError('Type of document material must be array!');
    }

    if (typeof weight !== 'number') {
      throw new ApolloError('Type of weight submodule is must be number and required');
    }

    if (!mongoose.isValidObjectId(parent_course)) {
      throw new ApolloError('Parent course id is required and must be valid mongoose id!');
    }

    const course = await CourseModel.findById(parent_course).lean();

    if (!course) {
      throw new ApolloError('Parent course id is not valid, course is not found!');
    }

    if (!mongoose.isValidObjectId(parent_module)) {
      throw new ApolloError('Parent module id is required and must be valid mongoose id!');
    }

    const module = await ModuleModel.findById(parent_module).lean();

    if (!module) {
      throw new ApolloError('Parent module id is not valid, module is not found!');
    }
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateCreateSubmodule',
      parameter_function: JSON.stringify({
        title_submodule,
        description_submodule,
        video_material,
        image_material,
        document_material,
        weight,
        parent_course,
        parent_module,
      }),
      path: 'src/graphql/submodule/submodule.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

const ValidateWeightSubmodule = async ({ weight, parent_module }) => {
  try {
    if (typeof weight !== 'number') {
      throw new ApolloError('Type of weight submodule is must be number and required');
    }

    if (!mongoose.isValidObjectId(parent_module)) {
      throw new ApolloError('Parent module id is required and must be valid mongoose id!');
    }

    const module = await ModuleModel.findById(parent_module).populate({ path: 'submodules' }).lean();

    if (!module) {
      throw new ApolloError('Parent module id is not valid, module is not found!');
    }

    const oldSubmodules = module.submodules ? module.submodules : [];

    let isWeightValid = false;

    if (oldSubmodules.length < 1) {
      return (isWeightValid = weight <= 100);
    }

    const totalWeight = oldSubmodules.reduce((accumulator, submodule) => (accumulator += submodule.weight ? submodule.weight : 0), 0);

    return (isWeightValid = totalWeight + weight <= 100);
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateWeightSubmodule',
      parameter_function: JSON.stringify({ weight, parent_module }),
      path: 'src/graphql/submodule/submodule.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

const ValidateUniqueTitleSubmodule = async ({ title_submodule, parent_module }) => {
  try {
    if (!title_submodule || typeof title_submodule !== 'string') {
      throw new ApolloError('Title submodule is required and must be string!');
    }

    if (!mongoose.isValidObjectId(parent_module)) {
      throw new ApolloError('Parent module id is required and must be valid id mongoose!');
    }

    const module = await ModuleModel.findById(parent_module).populate({ path: 'submodules' }).lean();

    if (!module) {
      throw new ApolloError('Parent module id is not valid, not found module!');
    }

    const oldSubmodules = module.submodules ? module.submodules : [];

    let isUniqueTitle = true;

    if (oldSubmodules.length < 1) {
      return isUniqueTitle;
    }

    oldSubmodules.forEach((oldSubmodule) => {
      if (oldSubmodule.title_submodule === title_submodule) {
        isUniqueTitle = false;
      }
    });

    return isUniqueTitle;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'ValidateUniqueTitleSubmodule',
      parameter_function: JSON.stringify({ title_submodule, parent_module }),
      path: 'src/graphql/submodule/submodule.validator.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

module.exports = {
  ValidateCreateSubmodule,
  ValidateWeightSubmodule,
  ValidateUniqueTitleSubmodule,
};
