const { CreateCourse } = require('./course.utilities');

const CourseResolver = {
  Mutation: {
    CreateCourse,
  },
};

module.exports = CourseResolver;
