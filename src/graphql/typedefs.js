const UserTypedef = require('./user/user.typedefs');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typeDefs = mergeTypeDefs([UserTypedef]);

module.exports = typeDefs;
