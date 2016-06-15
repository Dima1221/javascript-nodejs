const jade = require('lib/serverJade');
const config = require('config');
const path = require('path');

module.exports = function* (transaction) {

  var form = jade.renderFile(path.join(__dirname, 'templates/form.jade'), {
    amount: transaction.amount,
    number: transaction.number,
    currency: config.payments.currency,
    id:     config.payments.modules.payanyway.id,
    // limitIds: process.env.NODE_ENV == 'development' ? '' : 'card,248362,822360,545234,1028'
    limitIds: process.env.NODE_ENV == 'development' ? '' : 'card,248362,822360,545234,1028'
  });

  return form;

};


