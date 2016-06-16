/**
 * Process all unfinished payments for Ya.Money,
 * CRONTAB: call every minute
 * @type {exports}
 */

const config = require('config');
const Order = require('../../models/order');
const Transaction = require('../../models/transaction');
const request = require('co-request');

var updatePendingOnlineTransactionStatus = require('../lib/updatePendingOnlineTransactionStatus');

/* jshint -W106 */
exports.get = function* () {

  var transactions = yield Transaction.find({
    order:                       this.order._id,
    status:                      Transaction.STATUS_PENDING,
    paymentMethod:               'yandexmoney',
    'paymentDetails.nextRetry':  {
      $gte: Date.now()
    },
    'paymentDetails.processing': {
      $ne: true
    }
  });

  for (var i = 0; i < transactions.length; i++) {
    var transaction = transactions[i];
    this.log("processPayments", transaction);
    yield* updatePendingOnlineTransactionStatus(transaction);
  }

};
