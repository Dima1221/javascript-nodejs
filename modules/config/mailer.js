var secret = require('./secret');

module.exports = {
  senders:  {
    // transactional emails, register/forgot pass etc
    default:  {
      fromEmail: 'notify@javascript.ru',
      fromName:  'JavaScript.ru',
      signature: "<em>С уважением,<br>Илья Кантор</em>"
    },
    // important emails about orders
    orders:  {
      fromEmail: 'orders@javascript.ru',
      fromName:  'JavaScript.ru',
      signature: "<em>С уважением,<br>Илья Кантор</em>"
    },
    // newsletters
    informer: {
      fromEmail: 'informer@javascript.ru',
      fromName:  'JavaScript.ru',
      signature: "<em>Успешной разработки!<br>Илья Кантор</em>"
    },
    mgrinko: {
      fromEmail: 'm.grinko@javascript.ru',
      fromName:  'Михаил Гринько (JavaScript.ru)',
      signature: "<em>Успешной разработки!<br>Михаил Гринько</em>"
    },
    ikantor: {
      fromEmail: 'iliakan@javascript.ru',
      fromName:  'Илья Кантор (JavaScript.ru)',
      signature: "<em>Успешной разработки!<br>Илья Кантор</em>"
    },
    riakobchuk: {
      fromEmail: 'r.iakobchuk@javascript.ru',
      fromName:  'Роман Якобчук (JavaScript.ru)',
      signature: "<em>Успешной разработки!<br>Роман Якобчук</em>"
    },
    ssuvorov: {
      fromEmail: 's.suvorov@javascript.ru',
      fromName:  'Степан Суворов (JavaScript.ru)',
      signature: "<em>Успешной разработки!<br>Степан Суворов</em>"
    },
    inepipenko: {
      fromEmail: 'i.nepipenko@javascript.ru',
      fromName:  'Игорь Непипенко (JavaScript.ru)',
      signature: "<em>Успешной разработки!<br>Игорь Непипенко</em>"
    }
  },
  mandrill: {
    apiKey: secret.mandrill.apiKey,
    webhookKey: secret.mandrill.webhookKey,
    // current running site may have another domain (proxied from webhookurl)
    // that's why I set the webhookUrl separately
    webhookUrl: secret.mandrill.webhookUrl
  }


};
