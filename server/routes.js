const Router = require('koa-router')
// const convert = require('koa-convert')
// const bodyParser = require('koa-bodyparser')

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
const { applyRes } = require('./controllers/platform')

// const parseBody = convert(
//   bodyParser({
//     formLimit: '200kb',
//     jsonLimit: '200kb',
//     bufferLimit: '4mb',
//   })
// )

const router = new Router()

router
  .use(proxy('/devops_webhook/(.*)', devopsWebhookProxy))
  .use(proxy('/b2i_download/(.*)', b2iFileProxy))
  .get('/dockerhub/(.*)', handleDockerhubProxy)
  // .get('/dockerhub/(.*)', parseBody, handleDockerhubProxy)
  .get('/blank_md', renderMarkdown)

  .all('/(k)?api(s)?/(.*)', checkToken, checkIfExist)
  .use(proxy('/(k)?api(s)?/(.*)', k8sResourceProxy))

  .get('/sample/:app', handleSampleData)
  // .get('/sample/:app', parseBody, handleSampleData)

  // session
  .post('/login', handleLogin)
  .get('/login', renderLogin)
  .post('/login/confirm', handleLoginConfirm)
  // .post('/login/confirm', parseBody, handleLoginConfirm)
  .get('/login/confirm', renderLoginConfirm)
  .post('/logout', handleLogout)

  // oauth
  .get('/oauth/redirect/:name', handleOAuthLogin)

  // terminal
  .get('/terminal*', renderTerminal)

  // ai-platform
  .post('/apply', applyRes)

  // page entry
  .all('*', renderView)

module.exports = router
