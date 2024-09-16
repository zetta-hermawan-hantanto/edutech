const SubmoduleModel = require('../../database/models/submodule.model');
const ModuleModel = require('../../database/models/module.model');
const ErrorModel = require('../../database/models/error.model');
const { ApolloError } = require('apollo-server-express');
const { ValidateCreateSubmodule, ValidateWeightSubmodule, ValidateUniqueTitleSubmodule } = require('./submodule.validator');
const { ValidateInstructor } = require('../../utils/globalValidator/validateInstructor');

const CreateSubmodule = async (parent, { input }, context) => {
  try {
    await ValidateInstructor({ context });

    const {
      title_submodule,
      description_submodule,
      video_material,
      image_material,
      document_material,
      weight,
      parent_course,
      parent_module,
    } = input;

    await ValidateCreateSubmodule({
      title_submodule,
      description_submodule,
      video_material,
      image_material,
      document_material,
      weight,
      parent_course,
      parent_module,
    });

    if (
      !(await ValidateUniqueTitleSubmodule({
        title_submodule,
        parent_module,
      }))
    ) {
      throw new ApolloError('Title submodules must be unique accross submodule of module');
    }

    if (
      !(await ValidateWeightSubmodule({
        weight,
        parent_module,
      }))
    ) {
      throw new ApolloError('Weight submodule is not valid, total of weight submodules in this module must not greather than 100');
    }

    const newSubmodule = await SubmoduleModel.create({
      title_submodule,
      description_submodule,
      video_material,
      image_material,
      document_material,
      weight,
      tests: [],
      parent_course,
      parent_module,
    });

    if (!newSubmodule) {
      throw new ApolloError('Error when create submodule');
    }

    await ModuleModel.findByIdAndUpdate(newSubmodule.parent_module, {
      $push: { submodules: newSubmodule._id },
    });

    return newSubmodule;
  } catch (error) {
    console.log(error);
    await ErrorModel.create({
      name_function: 'CreateSubmodule',
      parameter_function: JSON.stringify(input),
      path: 'src/graphql/submodule/submodule.utilities.js',
      error: String(error),
    });
    throw new ApolloError(error.message);
  }
};

// const CreateSubmodule = async (parent, { input }, context) => {
//     try {
//     } catch (error) {
//       console.log(error);
//       await ErrorModel.create({
//         name_function: 'CreateSubmodule',
//         parameter_function: JSON.stringify(input),
//         path: 'src/graphql/submodule/submodule.utilities.js',
//         error: String(error),
//       });
//       throw new ApolloError(error.message);
//     }
//   };

module.exports = {
  CreateSubmodule,
};
