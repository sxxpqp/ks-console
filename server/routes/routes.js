import Router from 'koa-router'
// import convert from 'koa-convert'
// import bodyParser from 'koa-bodyparser'
import koaBody from 'koa-body'

import proxy from '../middlewares/proxy'
import checkToken from '../middlewares/checkToken'
import checkIfExist from '../middlewares/checkIfExist'

import { k8sResourceProxy, devopsWebhookProxy, b2iFileProxy } from '../proxy'

import { handleSampleData, handleDockerhubProxy } from '../controllers/api'

import {
  handleLogin,
  handleLogout,
  handleOAuthLogin,
  handleLoginConfirm,
} from '../controllers/session'

import {
  renderTerminal,
  renderLogin,
  renderLoginConfirm,
  renderMarkdown,
} from '../controllers/view'

// platform
import { handlerTransfer } from '../controllers/platform'

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

export default router
