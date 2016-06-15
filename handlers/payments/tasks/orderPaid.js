'use strict';

var co = require('co');
var gutil = require('gulp-util');
var Order = require('../models/order');
var currencyRate = require('currencyRate');

module.exports = function() {

  var args = require('yargs')
    .example('gulp payments:order:paid --number 484')
    .demand(['number'])
    .argv;

  return function() {

    return co(function*() {
      yield* currencyRate.boot();

      var order = yield Order.findOne({number: args.number}).exec();

      if (!order) {
        throw new Error("No order with number " + args.number);
      }

      if (order.status == Order.STATUS_SUCCESS && !args.force) {
        throw new Error("Order already success " + args.number);
      }

      yield* order.onPaid();

      order.status = Order.STATUS_SUCCESS;
      if ("amount" in args) {
        order.amount = +args.amount;
      }

      yield order.persist();

    });

  };
};

