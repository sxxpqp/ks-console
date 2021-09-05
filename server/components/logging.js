const log4js = require('../services/log4j')

// 全局错误日志
global.logError = log4js.getLogger('error')
global.logApp = log4js.getLogger('application').info

module.exports = function(app) {
  app.logger = log4js.getLogger('error')
  if (global.MODE_DEV) {
    app.use(
      log4js.koaLogger(log4js.getLogger('http'), {
        level: 'auto',
      })
    )
  } else {
    app.use(
      log4js.koaLogger(log4js.getLogger('access'), {
        level: 'auto',
      })
    )
  }
}
