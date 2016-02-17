const Newsletter = require('../models/newsletter');
const Subscription = require('../models/subscription');
const SubscriptionAction = require('../models/subscriptionAction');
const config = require('config');

exports.get = function*() {
  this.nocache();

  const subscriptionAction = yield SubscriptionAction.findOne({
    accessKey: this.params.accessKey
  }).exec();

  if (!subscriptionAction) {
    this.throw(404);
  }

  if (subscriptionAction.applied) {
    this.throw(403, {info: "Подтверждение уже было обработано ранее." });
  }

  var subscription = yield subscriptionAction.apply();

  yield subscriptionAction.persist();

  if (subscriptionAction.action == 'remove') {
    this.body = this.render('removed');
    return;
  }

  this.addFlashMessage('success', 'Подписка подтверждена.');
  this.redirect('/newsletter/subscriptions/' + subscription.accessKey);

};
