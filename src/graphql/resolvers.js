const UserResolvers = require('./user/user.resolvers');
const { mergeResolvers } = require('@graphql-tools/merge');

const resolvers = mergeResolvers([UserResolvers]);

module.exports = resolvers;
