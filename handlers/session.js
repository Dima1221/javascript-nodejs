const mongoose = require('mongoose');
const session = require('koa-generic-session');
const mongooseStore = require('koa-session-mongoose');
const config = require('config');

exports.init = function(app) {

  var options = {
    store: mongooseStore.create({
      model:   'Session',
      // expires in DB is same as cookie maxAge, but in seconds
      expires: config.auth.session.cookie.maxAge / 1000
    })
  };

  app.use(session(Object.assign(options, config.auth.session)));

  app.keys = config.appKeys;  // needed for cookie-signing

};
