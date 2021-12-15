import combineRouters from 'koa-combine-routers'
import Router from 'koa-router'
import { renderView } from '../controllers/view'

// custom
import k8sRouter from './routes'
import aiRouter from './ai'

// page entry
const router = new Router()
router.all('*', renderView)

export default combineRouters(k8sRouter, aiRouter, router)
