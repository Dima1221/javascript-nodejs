const payments = require('payments');

var paymentMethods = {};

var methodsEnabled = ['yakassa', 'webmoney', 'yandexmoney', 'paypal', 'payanyway', 'interkassa'];

methodsEnabled.forEach(function(key) {
  paymentMethods[key] = payments.methods[key].info;
});

module.exports = paymentMethods;
