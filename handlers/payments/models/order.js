'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var Transaction = require('./transaction');
var _ = require('lodash');
var money = require('money');

var schema = new Schema({
  amount: {
    type:     Number,
    required: true
  },

  currency: {
    // sometimes needed, e.g. donate allows multiple currencies
    // courses can be sold in USD directly by the teacher
    type:    String,
    default: 'RUB',
    enum:    ['USD', 'EUR', 'RUB', 'UAH']
  },

  // amount in stable currency, for sorting by amount
  usdAmount: {
    type: Number
  },

  module:      { // module so that transaction handler knows where to go back e.g. 'ebook'
    type:     String,
    required: true
  },

  title:       {
    type:     String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  status:      {
    type:    String,
    enum:    ['success', 'cancel', 'pending', 'paid'],
    default: 'pending'
  },

  // order can be bound to either an email or a user
  email: {
    type:  String,
    lowercase: true,
    trim: true,
    index: true
  },

  user: {
    type:  Schema.Types.ObjectId,
    ref:   'User',
    index: true
  },

  data: {
    type:    Schema.Types.Mixed,
    default: {}
  },

  created:  {
    type:    Date,
    default: Date.now
  },

  modified: {
    type: Date
  }

});

schema.pre('save', function(next) {
  this.modified = new Date();

  if (this.isModified('amount')) {
    try {
      this.usdAmount = money.convert(this.amount, {from: this.currency, to: 'USD'});
    } catch (e) {
      return next(typeof e == 'string' ? new Error(e) : e);
    }
  }
  next();
});

// order must have only 1 pending transaction at 1 time.
// finish one payment then create another
// UI does not allow to create multiple pending transaction
//  that's to easily find/cancel a pending method
// Here I guard against hand-made POST requests (just to be sure)
// P.S. it is ok to create a transaction if a SUCCESS one exists (maybe split payment?)
schema.methods.cancelPendingTransactions = function*(statusMessage) {

  yield Transaction.findOneAndUpdate({
    order:  this._id,
    status: Transaction.STATUS_PENDING
  }, {
    status:        Transaction.STATUS_FAIL,
    statusMessage: statusMessage
  });

};

schema.methods.convertAmount = function(currencyCode) {
  return (this.currency == currencyCode) ? this.amount :
    Math.ceil(money.convert(this.amount, {from: this.currency, to: currencyCode}));
};

schema.methods.onPaid = function*(transaction) {
  // transaction which has actually paid the order (if exists)
  if (transaction) {

    // it is possible that a "failed" transaction is paid while another "newer" one is pending
    // e.g two bank invoices, the older one is paid
    if (transaction.status == Transaction.STATUS_FAIL) {
      yield* this.cancelPendingTransactions("оплачена предыдущая транзакция.");
    }

    // now let's check if there is a successful TX for this order already
    // that would be strange (2 payments for one thing? a mistake!)
    let existingSuccessTx = yield Transaction.findOne({
      order:  this._id,
      status: Transaction.STATUS_SUCCESS
    });

    if (existingSuccessTx) {
      throw new Error("onPaid triggered for tx " + transaction._id + " but another success tx exists already " + existingSuccessTx._id);
    }

    transaction.status = Transaction.STATUS_SUCCESS;

    yield transaction.persist();
  }

  this.persist({
    status: Order.STATUS_PAID
  });

  yield* require(this.module).onPaid(this);
};

schema.methods.cancelIfPendingTooLong = function*() {
  yield* require(this.module).cancelIfPendingTooLong(this);
};

schema.plugin(autoIncrement.plugin, {model: 'Order', field: 'number', startAt: 1});

// order is ready for delivery, hooks finished
schema.statics.STATUS_SUCCESS = 'success';

// payment received, but the order hooks did not finish yet
schema.statics.STATUS_PAID = 'paid';

// awaiting payment
schema.statics.STATUS_PENDING = 'pending';

// not awaiting payment any more
schema.statics.STATUS_CANCEL = 'cancel';

schema.methods.getUrl = function() {
  return '/' + this.module + '/orders/' + this.number;
};

var Order = module.exports = mongoose.model('Order', schema);

