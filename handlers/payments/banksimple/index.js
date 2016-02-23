const Transaction = require('../models/transaction');
const path = require('path');
const money = require('money');

exports.renderForm = require('./renderForm');

// TX gets this status when created
exports.createTransaction = function*(order) {

  var transaction = new Transaction({
    order:  order._id,
    amount: order.convertAmount('RUB'),
    currency: 'RUB',
    status: Transaction.STATUS_PENDING,
    paymentMethod: path.basename(__dirname)
  });

  yield transaction.persist();

  return transaction;
};

exports.info = {
  title:   "Банковский перевод",
  name:    path.basename(__dirname),
  hasIcon: false,
  cards: ['sberbank'],
  subtitle: 'или другой банк',
  currency: 'RUB'
};
