// must be above router, because router uses auth (which uses user)
// cyclic require here

const config = require('config');
exports.User = require('./models/user');
exports.routeUserById = require('./lib/routeUserById');

var mountHandlerMiddleware = require('lib/mountHandlerMiddleware');

exports.init = function(app) {

  app.use( mountHandlerMiddleware('/users', __dirname) );

  app.use(function*(next) {
    Object.defineProperty(this, 'isAdmin', {
      get: function() {
        // service may authorize with X-Admin-Key header
        return this.user && this.user.hasRole('admin') || this.get('X-Admin-Key') === config.adminKey;
      }
    });

    // Fixme: move to logger?
    if (this.isAdmin) {
      this.log.level("debug");
    }

    yield* next;
  });


};

