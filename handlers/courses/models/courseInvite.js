var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var schema = new Schema({

  // invite page visited
  // -> check order if the person is in the list (not removed)
  // -> add to participants and accept
  // invite belongs to the order, not group,
  // so we can check it agains order actual participants
  order: {
    type: Schema.Types.ObjectId,
    ref:  'Order'
    // not required, invite may exist without an order (theoretically?)
  },

  // when order is null,
  // this field is the only way to get the group to join
  group: {
    type: Schema.Types.ObjectId,
    ref:  'CourseGroup',
    required: true
  },

  token: {
    type: String,
    required: true,
    default: function() {
      return parseInt(crypto.randomBytes(4).toString('hex'), 16).toString(36);
    }
  },

  // for history how this participant was created
  participant: {
    type: Schema.Types.ObjectId,
    ref:  'CourseParticipant'
    // should be required, but added after participants w/o it existed already
  },

  email: {
    type: String,
    lowercase: true,
    required: true
  },

  accepted: {
    type: Boolean,
    required: true,
    default: false
  },

  validUntil: {
    type: Date,
    required: true
    // invite is also a login token, so limit it
    // max(group + 7 days, created + 7 days)
  },

  created: {
    type:    Date,
    default: Date.now
  }
});


schema.methods.accept = function*(participant) {
  yield this.persist({
    participant: participant,
    accepted: true
  });
};

module.exports = mongoose.model('CourseInvite', schema);

