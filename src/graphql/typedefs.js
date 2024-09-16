const UserTypedef = require('./user/user.typedefs');
const CourseTypedef = require('./course/course.typedefs');
const ModuleTypedef = require('./module/module.typedefs');
const SubmoduleTypedef = require('./submodule/submodule.typedefs');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typeDefs = mergeTypeDefs([UserTypedef, CourseTypedef, ModuleTypedef, SubmoduleTypedef]);

module.exports = typeDefs;
