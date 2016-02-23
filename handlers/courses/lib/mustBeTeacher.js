const _ = require('lodash');

module.exports = function*(next) {

  var group = this.groupBySlug;

  if (!this.user) {
    this.throw(401);
  }

  if (this.user._id.equals(group.teacher._id)) {
    this.teacher = this.user;
    yield* next;
  } else {
    this.throw(403, "Вы не являетесь преподавателем этой группы.");
  }
};
