
const path = require('path');
const Transaction = require('../models/transaction');

exports.renderForm = require('./renderForm');

exports.createTransaction = function*(order) {

  var transaction = new Transaction({
    order:  order._id,
    currency: 'RUB',
    amount: order.convertAmount('RUB'),
    status: Transaction.STATUS_PENDING,
    paymentMethod: path.basename(__dirname)
  });

  yield transaction.persist();

  return transaction;
};

exports.info = {
  title:   "WebMoney",
  name:    path.basename(__dirname),
  hasIcon: true,
  currency: 'RUB'
};

