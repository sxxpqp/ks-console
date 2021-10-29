const Koa = require('koa')
const path = require('path')
// const koaBody = require('koa-body')

Koa.prototype.apply = function(module, ...rest) {
  module(this, ...rest)
  return this
}

global.MODE_DEV = process.env.NODE_ENV === 'development'
global.APP_ROOT = path.resolve(__dirname, '../')

const { getServerConfig } = require('./libs/utils')
const boot = require('./components/boot')
const locale = require('./components/locale')
// 日志
const logging = require('./components/logging')
const wsProxy = require('./components/wsProxy')
const errorProcess = require('./components/errorProcess')
const routes = require('./routes')

const { sequelize } = require('./services/sequelize')
const { initModels } = require('./models/init-models')
const { redisInit } = require('./services/redis-helper')
const { ftpsInit } = require('./services/ftps')
const { sshInit } = require('./services/ssh')
const { cronJob } = require('./services/cron')
// const { createProject } = require('./libs/user')

// const { kubctl, getImage } = require('./libs/platform')

// const info = {
//   podName: 'nginx-y9lhg3-5847d595f4-s56x6',
//   namespace: 'test',
// }

// const options = {
//   host: '192.168.4.33',
//   port: 22,
//   username: 'root',
//   password: 'Xl123456..',
// }

// kubctl(info, options)
//   .then(res => {
//     console.log(res)
//     const names = res.map(item => item.name)
//     getImage({ ...info, container: names[0] }, options).then(res1 => {
//       console.log(res1)
//     })
//   })
//   .catch(err => {
//     console.log(err)
//   })

// 定时任务
cronJob.start()

const app = new Koa()
const config = getServerConfig()
const serverConfig = config.server

global.HOSTNAME = serverConfig.http.hostname || 'localhost'
global.PORT = serverConfig.http.port || 8000
global.config = config
global.server = serverConfig

// 数据库初始化
const db = sequelize(serverConfig.db)
global.models = initModels(db)

// redis初始化
const redis = redisInit(serverConfig.redis)
global.redis = redis

// ftp初始化
const ftpOptions = serverConfig.ftp
global.ftpOptions = ftpOptions
global.ftp = ftpsInit
global.sshInit = sshInit

// ssh脚本

app.keys = ['kubesphere->_<']

// const run = async () => {
//   const result = await createProject('test4-namespace', 'project5', 'test2')
//   console.log('🚀 ~ file: server.js ~ line 89 ~ run ~ result', result)
// }
// run()
app
  .apply(boot)
  // 提供翻译
  .apply(locale)
  .apply(logging)
  .apply(errorProcess)
  // .use(
  //   koaBody({
  //     multipart: true,
  //     formidable: {
  //       keepExtensions: true,
  //       maxFieldsSize: 5 * 1024 * 1024,
  //     },
  //     onError: err => {
  //       // eslint-disable-next-line no-console
  //       console.log('koabody TCL: err', err)
  //     },
  //   })
  // )
  .use(routes.routes())

app.server = app.listen(global.PORT, err => {
  if (err) {
    return console.error(err)
  }
  /* eslint-disable no-console */
  console.log(`Dashboard app running at port ${global.PORT}`)
})

app.apply(wsProxy)
