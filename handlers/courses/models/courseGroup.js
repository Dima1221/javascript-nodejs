var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('config');
var fs = require('mz/fs');
var path = require('path');
var log = require('log')();
var validate = require('validate');
var CourseMaterial = require('./courseMaterial');

var schema = new Schema({
  // 01.01.2015
  dateStart: {
    type:     Date,
    required: true
  },
  // 05.05.2015
  dateEnd:   {
    type:     Date,
    required: true
  },

  duration: { // duration in minutes
    type: Number
  },
  rrule: {
    freq:  {
      type:    String,
      uppercase: true,
      default: 'WEEKLY'
    },
    byday: [{
      type: String,
      uppercase: true,
      enum: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
    }]
  },

  // like "nodejs-0402", for urls
  slug: {
    type:     String,
    required: true,
    unique:   true
  },

  price: {
    type:     Number,
    required: true
  },

  // Every mon and thu at 19:00 GMT+3
  timeDesc: {
    type:     String,
    required: true,
    trim:     true
  },

  // currently available places
  // decrease onPaid
  participantsLimit: {
    type:     Number,
    required: true
  },

  teacher: {
    type:     Schema.Types.ObjectId,
    ref:      'User',
    required: true
  },

  videoKeyTagCached: {
    type:  String,
    index: true
  },

  // group w/o materials can set this to undefined
  // otherwise there will be a link to the page (maybe without files yet)
  materials: {
    type:    [CourseMaterial.schema],
    default: []
  },

  // is this group in the open course list (otherwise hidden)?
  // even if not, the group is accessible by a direct link
  isListed: {
    type:     Boolean,
    required: true,
    default:  false
  },

  // is it possible to register?
  isOpenForSignup: {
    type:     Boolean,
    required: true,
    default:  false
  },

  // room jid AND gotowebinar id
  // an offline group may not have this
  webinarId: {
    type: String,
    trmi: true
  },

  skypeLink: {
    type: String,
    trim: true
  },

  course: {
    type:     Schema.Types.ObjectId,
    ref:      'Course',
    required: true
  },

  // JS/UI 10.01
  // a user-friendly group title
  title: {
    type:     String,
    required: true,
    trim:     true
  },

  created: {
    type:    Date,
    default: Date.now
  }
});


schema.methods.getMaterialUrl = function(material) {
  return `/courses/download/${this.slug}/${material.filename}`;
};

schema.methods.getFeedbackUrl = function(material) {
  return `/courses/groups/${this.slug}/feedback`;
};

schema.methods.getMaterialFileRelativePath = function(material) {
  return `courses/${this.slug}/${material.filename}`;
};

schema.methods.getMaterialFileSize = function* (material) {
  var stat = yield fs.stat(path.join(config.downloadRoot, this.getMaterialFileRelativePath(material)));
  return stat.size;
};

schema.methods.decreaseParticipantsLimit = function(count) {
  count = count === undefined ? 1 : count;
  this.participantsLimit -= count;
  if (this.participantsLimit < 0) this.participantsLimit = 0;
  if (this.participantsLimit === 0) {
    this.isOpenForSignup = false; // we're full!
  }
};

module.exports = mongoose.model('CourseGroup', schema);

