'use strict';

const mongoose = require('mongoose');
const countries = require('countries');
const CourseFeedback = require('../models/courseFeedback');
const CourseGroup = require('../models/courseGroup');
const CourseTeacher = require('../models/courseTeacher');
const Course = require('../models/course');
const User = require('users').User;
const groupBy = require('lodash/groupBy');
const CacheEntry = require('cache').CacheEntry;

exports.get = function*() {

  this.locals.course = yield Course.findOne({
    slug: this.params.course
  });

  if (!this.locals.course) {
    this.throw(404);
  }

  this.locals.title = "Отзыв о курсе\n" + this.locals.course.title;

  // star => count

  let feedbackStats = yield* CacheEntry.getOrGenerate({
    key:  'courses:feedback:' + this.params.course,
    tags: ['courses:feedback']
  }, getFeedbackStats.bind(this, this.locals.course));

  let teachers = yield CourseTeacher.find({
    course: this.locals.course._id
  }).populate('teacher');

  teachers = teachers.map(t => t.teacher);

  this.body = this.render('feedback/list', {
    stats: feedbackStats,
    teachers
  });

};


function* getFeedbackStats(course) {

  let groups = yield CourseGroup.find({
    course: course.id
  });

  let groupIds = groups.map(group => group._id);

  let stats = yield CourseFeedback.aggregate([
    {
      $match: {
        group: {
          $in: groupIds
        },
        isPublic: true
      }
    },
    {
      $group: {
        _id:   '$stars',
        count: {
          $sum: 1
        }
      }
    }
  ]).exec();

  let totalFeedbacks = stats.reduce(function(prev, next) { return prev + next.count; }, 0);

  //console.log(totalFeedbacks);
  // default stats (if no stars for a star)
  let starStatsPopulated = {};
  for(let i=1; i<=5; i++) starStatsPopulated[i] = {
    count: 0,
    fraction: 0
  };

  stats.forEach(function(stat) {
    starStatsPopulated[stat._id] = {
      count: stat.count,
      fraction: stat.count ? +(stat.count / totalFeedbacks).toFixed(2) : 0
    };
  });


  let recommendStats = yield CourseFeedback.aggregate([
    {
      $match: {
        group: {
          $in: groupIds
        },
        isPublic: true
      }
    },
    {
      $group: {
        _id:   '$recommend',
        count: {
          $sum: 1
        }
      }
    }
  ]).exec();


  recommendStats = groupBy(recommendStats, '_id');

  if (!recommendStats[true]) recommendStats[true] = [{count: 0}];
  if (!recommendStats[false]) recommendStats[false] = [{count: 0}];

  // 76% recommend
  let recommendFraction = recommendStats[true][0].count / (recommendStats[true][0].count + recommendStats[false][0].count) || 0;

  return {
    stars: starStatsPopulated,
    recommendFraction: recommendFraction,
    total: totalFeedbacks
  };
}
