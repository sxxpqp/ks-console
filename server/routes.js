const Router = require('koa-router')
// const convert = require('koa-convert')
// const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')

const proxy = require('./middlewares/proxy')
const checkToken = require('./middlewares/checkToken')
const checkIfExist = require('./middlewares/checkIfExist')

const {
  k8sResourceProxy,
  devopsWebhookProxy,
  b2iFileProxy,
} = require('./proxy')

const { handleSampleData, handleDockerhubProxy } = require('./controllers/api')

const {
  handleLogin,
  handleLogout,
  handleOAuthLogin,
  handleLoginConfirm,
} = require('./controllers/session')

const {
  renderView,
  renderTerminal,
  renderLogin,
  renderLoginConfirm,
  renderMarkdown,
} = require('./controllers/view')

// platform
const {
  applyRes,
  getApply,
  updateApply,
  getNodes,
  saveDocker,
  copyApp,
  handlerTransfer,
} = require('./controllers/platform')

// users
const {
  getMenus,
  addMenu,
  editMenu,
  removeMenu,
  upload,
} = require('./controllers/users')

// const parseBody = convert(
//   bodyParser({
//     formLimit: '200kb',
//     jsonLimit: '200kb',
//     bufferLimit: '4mb',
//   })
// )
const parseBody = koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true,
    maxFieldsSize: 5 * 1024 * 1024,
  },
  onError: err => {
    // eslint-disable-next-line no-console
    console.log('koabody TCL: err', err)
  },
})

const router = new Router()

router
  .use(proxy('/devops_webhook/(.*)', devopsWebhookProxy))
  .use(proxy('/b2i_download/(.*)', b2iFileProxy))
  // .get('/dockerhub/(.*)', handleDockerhubProxy)
  .get('/dockerhub/(.*)', parseBody, handleDockerhubProxy)
  .get('/blank_md', renderMarkdown)

  .all('/(k)?api(s)?/(.*)', checkToken, checkIfExist)
  .use(proxy('/(k)?api(s)?/(.*)', k8sResourceProxy))

  // .get('/sample/:app', handleSampleData)
  .get('/sample/:app', parseBody, handleSampleData)

  // session
  .post('/login', parseBody, handleLogin)
  .get('/login', renderLogin)
  // .post('/login/confirm', handleLoginConfirm)
  .post('/login/confirm', parseBody, handleLoginConfirm)
  .get('/login/confirm', renderLoginConfirm)
  .post('/logout', handleLogout)

  // oauth
  .get('/oauth/redirect/:name', handleOAuthLogin)

  // terminal
  .get('/terminal*', renderTerminal)
  // transfer
  .post('/transfer', parseBody, checkToken, handlerTransfer)

router
  .use(parseBody)
  // ai-platform
  .post('/apply', applyRes)
  .get('/apply', getApply) // 获取审批资源
  .put('/apply', updateApply) // 获取审批资源

  .get('/nodes', getNodes) // 获取节点资源
  // 用户相关
  .get('/getMenus', getMenus) // 获取平台菜单
  .post('/addMenu', addMenu) // 获取平台菜单
  .post('/editMenu', editMenu) // 获取平台菜单
  .post('/removeMenu', removeMenu) // 获取平台菜单
  .post('/upload', upload) // 上传文件
  .post('/saveDocker', saveDocker) // 容器固化
  .post('/copyApp', copyApp) // 容器固化

// page entry
router.all('*', renderView)

module.exports = router
