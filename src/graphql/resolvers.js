const UserResolver = require('./user/user.resolvers');
const CourseResolver = require('./course/course.resolvers');
const ModuleResolver = require('./module/module.reolvers');
const SubmoduleResolver = require('./submodule/submodule.resolvers');
const { mergeResolvers } = require('@graphql-tools/merge');

const resolvers = mergeResolvers([UserResolver, CourseResolver, ModuleResolver, SubmoduleResolver]);

module.exports = resolvers;
