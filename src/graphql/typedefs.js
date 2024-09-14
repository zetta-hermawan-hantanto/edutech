const UserTypedef = require('./user/user.typedefs');
const CourseTypedef = require('./course/course.typedefs');
const ModuleTypedef = require('./module/module.typedefs');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typeDefs = mergeTypeDefs([UserTypedef, CourseTypedef, ModuleTypedef]);

module.exports = typeDefs;
