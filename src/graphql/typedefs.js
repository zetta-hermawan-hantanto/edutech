const UserTypedef = require('./user/user.typedefs');
const CourseTypedef = require('./course/course.typedefs');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typeDefs = mergeTypeDefs([UserTypedef, CourseTypedef]);

module.exports = typeDefs;
