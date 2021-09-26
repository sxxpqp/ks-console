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

const app = new Koa()

const serverConfig = getServerConfig().server

global.HOSTNAME = serverConfig.http.hostname || 'localhost'
global.PORT = serverConfig.http.port || 8000

// 数据库初始化
const db = sequelize(serverConfig.db)
global.models = initModels(db)

// redis初始化
const redis = redisInit(serverConfig.redis)
global.redis = redis

// ftp初始化
const ftpOptions = serverConfig.ftp
global.ftpOptions = ftpOptions
global.ftp = ftpsInit(ftpOptions)
global.sshInit = sshInit(ftpOptions)

// ssh脚本
// pod_name=$1
// namespace=$2
// container=`kubectl get pod $1 -o yaml -n $2|grep container -A 10|grep ready -C 3|grep "  name:"|awk -F : '{print $2}'|awk  '{print $1}'|sed -n  "${3}p"`
// image=`docker ps | grep ${container}_${pod_name}_${namespace}| grep -v pause |awk '{print $1}'`
// echo $image
// dimage=192.168.4.31:30002/sxxpqp/$1$2
// docker commit ${image} ${dimage}
// docker login -usxxpqp -pXl123456 192.168.4.31:30002
// docker push ${dimage}:lastet

// sshInit({
//   host: '192.168.4.33',
//   username: 'root',
//   password: 'Xl123456..',
//   port: 22,
// }).then(async res => {
//   const podName = 'node7-56845bd598-cxl4j'
//   const namespace = 'test'
//   let image = ''
//   const containerCmd = await res.execCommand(
//     `kubectl get pod ${podName} -o yaml -n ${namespace}`,
//     {
//       cwd: '/',
//     }
//   )
//   const doc = yaml.load(containerCmd.stdout, 'utf-8')
//   const containers = get(doc, 'spec.containers')
//   for (let i = 0; i < containers.length; i++) {
//     const imageCmd = await res.execCommand(
//       `docker ps | grep ${containers[i].name}_${podName}_${namespace}| grep -v pause |awk '{print $1}'`
//     )
//     image = imageCmd.stdout
//     const dimage = `192.168.4.31:30002/sxxpqp/${podName}${namespace}`
//     const commitCmd = await res.execCommand(`docker commit ${image} ${dimage}`)
//     const dockerLoginCmd = await res.execCommand(
//       `docker login -usxxpqp -pXl123456 192.168.4.31:30002`
//     )
//     const dockerImagePush = await res.execCommand(
//       `docker push ${dimage}:latest`
//     )
//   }
// })
//  => {
// res.execCommand('ls -la', { cwd: '/' }).then(function(result) {
//   console.log(`STDOUT: ${result.stdout}`)
//   console.log(`STDERR: ${result.stderr}`)
// })
// })
// ftps.ls().exec(console.log)

app.keys = ['kubesphere->_<']

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
