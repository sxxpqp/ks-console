const Router = require('koa-router')
// const convert = require('koa-convert')
// const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')

const proxy = require('./middlewares/proxy')
const checkToken = require('./middlewares/checkToken')
const checkIfExist = require('./middlewares/checkIfExist')
const decodeToken = require('./middlewares/decodeToken')

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
  getNodes,
  editNodes,
  saveDocker,
  copyApp,
  handlerTransfer,
  getImages,
  getImagesDetail,
} = require('./controllers/platform')

// resources
const {
  applyRes,
  getApply,
  getApplyHis,
  updateApply,
  getUsersResources,
  getGroupResources,
  getResourceTemplate,
  addResourceTemplate,
  editResourceTemplate,
  removeResourceTemplate,
  getGroupResourcesCount,
} = require('./controllers/resource')

// users
const {
  getMenus,
  addMenu,
  editMenu,
  removeMenu,
  upload,
  getUsers,
  editUser,
  removeUser,
  addUsers,
  getRoles,
  addRole,
  editRole,
  removeRole,
  getGroups,
  addGroups,
  editGroups,
  removeGroups,
  getUserInfo,
} = require('./controllers/users')

// applications
const {
  getAppList,
  updateApp,
  removeApp,
  updateAppList,
  getAppTags,
  getAppTagsCountApp,
  getAppTagsById,
  getAppByTagsName,
  getAppByTagsId,
  addAppTags,
  editAppTags,
  removeAppTags,
  updateAppTags,
  resetAppTags,
  batchSetAppTags,
} = require('./controllers/applications')

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
  .use(decodeToken)
  // ai-platform
  .post('/apply', applyRes)
  .get('/apply', getApply) // 获取审批资源
  .get('/applyhis', getApplyHis) // 获取审批资源，用于管理员审核
  .put('/apply', updateApply) // 获取审批资源

  .get('/nodes', getNodes) // 获取节点资源
  .post('/edit-nodes', editNodes) // 编辑节点名称与节点组织，分配组织资源
  .get('/resource', getUsersResources) // 获取用户已申请资源
  .get('/group-resource', getGroupResources) // 获取用户组织已配置资源
  .get('/group-resource-all', getGroupResourcesCount) // 获取组织已配置资源

  // 用户相关
  .get('/menus', getMenus) // 获取平台菜单
  .post('/add-menu', addMenu) // 获取平台菜单
  .post('/edit-menu', editMenu) // 获取平台菜单
  .post('/remove-menu', removeMenu) // 获取平台菜单
  .post('/upload', upload) // 上传文件
  .post('/saveDocker', saveDocker) // 容器固化
  .post('/copyApp', copyApp) // 容器固化

  // 用户信息CRUD
  .get('/users', getUsers)
  .post('/users', addUsers)
  .post('/edit-users', editUser)
  .delete('/users/:id', removeUser)
  .get('/user-info', getUserInfo) // 获取用户信息

  // 角色信息CRUD
  .get('/roles', getRoles)
  .post('/roles', addRole)
  .post('/edit-role', editRole)
  .delete('/roles/:id', removeRole)
  // 组织信息
  .get('/groups', getGroups)
  .post('/groups', addGroups)
  .post('/edit-groups', editGroups)
  .delete('/remove-groups/:id', removeGroups)
  // 资源模板
  .get('/resources-template', getResourceTemplate)
  .post('/resources-template', addResourceTemplate)
  .post('/edit-resources-template', editResourceTemplate)
  .delete('/resources-template/:id', removeResourceTemplate)

  // 应用相关
  .post('/app-list', getAppList)
  .post('/update-app', updateApp)
  .delete('/remove-app/:id', removeApp)
  .post('/update-app-list', updateAppList)
  // 通过应用名称 获取 应用标签
  .get('/app-tags', getAppTagsById)
  .get('/app-tagsname', getAppByTagsName)
  // 通过标签ID 获取 应用
  .get('/app-tags-id', getAppByTagsId)
  // 标签
  .get('/app-labels', getAppTags)
  .get('/app-labels-sum', getAppTagsCountApp)
  .post('/app-labels', addAppTags)
  .post('/edit-labels', editAppTags)
  .delete('/app-labels/:id', removeAppTags)
  // 给应用添加标签
  .post('/add-app-labels', updateAppTags)
  .post('/reset-app-labels', resetAppTags)
  .post('/batch-app-labels', batchSetAppTags)
  // harbar镜像数据相关
  .get('/harbor-images', getImages)
  .get('/harbor-images-tags', getImagesDetail)

// page entry
router.all('*', renderView)

module.exports = router
