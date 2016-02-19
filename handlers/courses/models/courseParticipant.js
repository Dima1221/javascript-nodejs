'use strict';

var ucWordStart = require('textUtil/ucWordStart');
var mongoose = require('lib/mongoose');
var Schema = mongoose.Schema;
var config = require('config');
var mongooseTimestamp = require('lib/mongooseTimestamp');
var fs = require('mz/fs');
var path = require('path');
var log = require('log')();
var validate = require('validate');
var countries = require('countries');
var CourseGroup = require('./courseGroup');

// make sure ref:User is resolved when a gulp task wants this model
require('users').User;

var schema = new Schema({

  group: {
    type: Schema.Types.ObjectId,
    ref:  'CourseGroup',
    index: true,
    required: true
  },

  courseCache: {
    type: Schema.Types.ObjectId,
    ref:  'Course',
    index: true
    // required: true
    // assigned by the hook
  },

  // participation cancelled?
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },

  // for history how this participant was created
  invite: {
    type: Schema.Types.ObjectId,
    ref:  'CourseInvite'
    // should be required, but added after participants w/o it existed already
  },

  notes: {
    type: String,
    trim: true
  },

  firstName:  {
    type:      String,
    trim: true,
    validate:  [
      {validator: /\S/, msg: "Имя отсутствует."},
      {validator: validate.patterns.singleword, msg: "Имя дожно состоять из одного слова."}
    ],
    default: "",
    maxlength: 128
  },
  surname:    {
    type:      String,
    trim: true,
    validate:  [
      {validator: /\S/, msg: "Фамилия отсутствует."},
      {validator: validate.patterns.singleword, msg: "Фамилия должна состоять из одного слова."}
    ],
    default: "",
    maxlength: 128
  },
  photo:      {
    type: String
  },
  country:    {
    type: String,
    enum: Object.keys(countries.all),
    required: "Страна не указана."
  },
  city:       {
    type:      String,
    maxlength: 128
  },
  aboutLink:  {
    type:      String,
    trim: true,
    validate:  [
      function(value) {
        return value ? validate.patterns.webpageUrl.test(value) : true;
      },
      "Некорректный URL страницы."
    ],
    maxlength: 4 * 1024
  },
  occupation: {
    type:      String,
    trim: true,
    maxlength: 2 * 1024
  },
  purpose:    {
    type:      String,
    trim: true,
    maxlength: 16 * 1024
  },

  wishes:     {
    type:      String,
    trim: true,
    maxlength: 16 * 1024
  },

  user: {
    type: Schema.Types.ObjectId,
    ref:  'User',
    index: true,
    required: true
  },

  shouldNotifyMaterials: {
    type: Boolean,
    default: true
  },

  registrantKey: { // gotowebinar api registrant key
    type: String
  },
  joinUrl: {
    type: String // gotowebinar api register joinUrl
  },

  videoKey: {
    type: String
    // there may be groups without video & keys
    // for those with videos, video key is stored in participant
  }
});

schema.index({group: 1, user: 1}, {unique: true});

schema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.surname;
});


schema.pre('save', function(next) {
  var self = this;

  if (this.city) {
    this.city = ucWordStart(this.city);
  }

  if (this.group.course) {
    if (this.group.course._id) {
      this.courseCache = this.group.course._id;
    } else {
      this.courseCache = this.group.course;
    }
    next();
  } else {
    CourseGroup.findOne({_id: this.group}, function(err, group) {
      if (err) return next(err);
      self.courseCache = group.course;
      next();
    });
  }
});


schema.plugin(mongooseTimestamp);

module.exports = mongoose.model('CourseParticipant', schema);
