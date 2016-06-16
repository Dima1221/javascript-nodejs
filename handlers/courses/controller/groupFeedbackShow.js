"use strict";

const mongoose = require('mongoose');
const countries = require('countries');
const CourseFeedback = require('../models/courseFeedback');
const CourseParticipant = require('../models/courseParticipant');
const CourseGroup = require('../models/courseGroup');
const CourseTeacher = require('../models/courseTeacher');
const User = require('users').User;
const renderFeedback = require('../lib/renderFeedback');

exports.get = function*() {

  var number = +this.params.feedbackNumber;

  var courseFeedback = yield CourseFeedback.findOne({number: number}).populate('group');

  if (!courseFeedback) {
    this.throw(404);
  }

  yield CourseGroup.populate(courseFeedback.group, "course teacher");

  var authorOrAdminOrTeacher = false;
  if (this.user) {
    if (this.user.hasRole('admin') || this.user._id.equals(courseFeedback.userCache)) {
      authorOrAdminOrTeacher = true;
    } else {
      // teaches this course (not exactly same group)
      let isCourseTeacher = yield CourseTeacher.findOne({
        teacher: this.user._id,
        course:  courseFeedback.group.course._id
      });
      if (isCourseTeacher) {
        authorOrAdminOrTeacher = true;
      }
    }

  }

  if (!courseFeedback.isPublic && !authorOrAdminOrTeacher) {
    this.throw(403, "Отзыв не публичный");
  }

  var group = this.locals.group = courseFeedback.group;

  this.locals.title = "Отзыв\n" + group.title;
  this.locals.headTitle = "Отзыв на " + group.title;

  this.locals.countries = countries.all;

  var feedbackRendered = this.locals.courseFeedback = yield* renderFeedback(courseFeedback, this.user);
  feedbackRendered.shareEnabled = true;

  this.body = this.render('feedback/show');

};

