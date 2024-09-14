const { ApolloError } = require('apollo-server-express');

const ValidateCreateCourse = ({ title, description, category, level, tags }) => {
  if (!title) {
    throw new ApolloError('Title is required!');
  }

  if (!description) {
    throw new ApolloError('Description is required!');
  }

  if (!category || !Array.isArray(category) || category.length <= 0) {
    throw new ApolloError('Category is required!, minimum 1 category');
  }

  const levels = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];

  if (!level) {
    throw new ApolloError('Level is required');
  }

  if (!levels.includes(level)) {
    throw new ApolloError('Level is not valid!');
  }

  if (!tags || !Array.isArray(tags) || tags.length <= 0) {
    throw new ApolloError('Tags is required!, minimum 1 tags');
  }
};

module.exports = {
  ValidateCreateCourse,
};
