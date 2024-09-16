const UserTypedef = require('./user/user.typedefs');
const CourseTypedef = require('./course/course.typedefs');
const ModuleTypedef = require('./module/module.typedefs');
const SubmoduleTypedef = require('./submodule/submodule.typedefs');
const TestTypedef = require('./test/test.typedefs');
const RateTypedef = require('./rate/rate.typedefs');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typeDefs = mergeTypeDefs([UserTypedef, CourseTypedef, ModuleTypedef, SubmoduleTypedef, TestTypedef, RateTypedef]);

module.exports = typeDefs;
