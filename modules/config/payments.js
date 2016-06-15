var secret = require('./secret');

module.exports = {
  currency:     'RUB',
  supportEmail: 'orders@javascript.ru',
  modules:      {
    webmoney:    {
      secretKey: secret.webmoney.secretKey,
      purse:     secret.webmoney.purse
    },
    yandexmoney: {
      // full redirectUri, with host, because form-creating function isn't middleware, doesn't know context
      redirectUri:  process.env.SITE_HOST + '/payments/yandexmoney/back',
      clientId:     secret.yandexmoney.clientId,
      clientSecret: secret.yandexmoney.clientSecret,
      purse:        secret.yandexmoney.purse
    },

    yakassa: {
      shopId: secret.yakassa.shopId,
      scid: secret.yakassa.scid,
      secret: secret.yakassa.secret,
      certDir: secret.yakassa.certDir
    },

    payanyway: {
      id:     secret.payanyway.id,
      secret: secret.payanyway.secret
    },

    banksimple: secret.banksimple,
    banksimpleua: secret.banksimpleua,

    paypal: {
      email:    secret.paypal.email,
      pdtToken: secret.paypal.pdtToken
    },

    interkassa: {
      id:     secret.interkassa.id,
      secret: secret.interkassa.secret
    },

    invoice: secret.invoice,

    fail: {
      // dev only
    },

    success: {
      // dev only
    },

    free: {
      // request a freebie, accepted manually
    }
  }
};
