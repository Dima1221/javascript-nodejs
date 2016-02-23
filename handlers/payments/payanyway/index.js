const Transaction = require('../models/transaction');
const path = require('path');
const money = require('money');

exports.renderForm = require('./renderForm');

// TX gets this status when created
exports.createTransaction = function*(order) {


  var transaction = new Transaction({
    order:         order._id,
    currency:      'RUB',
    amount:        order.convertAmount('RUB'),
    status:        Transaction.STATUS_PENDING,
    paymentMethod: path.basename(__dirname)
  });

  yield transaction.persist();

  return transaction;
};


exports.info = {
  title:    "Payanyway",
  name:     path.basename(__dirname),
  subtitle: "банковские карты, резервный метод",
  cards:    ['visa-mastercard'],
  hasIcon:  false,
  currency: 'RUB'
};

