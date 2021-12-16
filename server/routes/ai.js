import Router from 'koa-router'
import koaBody from 'koa-body'
import decodeToken from '../middlewares/decodeToken'
// platform
import {
  getNodes,
  editNodes,
  saveDocker,
  copyApp,
  getImages,
  getImagesDetail,
  getAlertMessage,
  updateAlertMessage,
} from '../controllers/platform'

// resources
import {
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
} from '../controllers/resource'

// users
import {
  getMenus,
  addMenu,
  editMenu,
  removeMenu,
  batchRemoveMenu,
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
} from '../controllers/users'

// applications
import {
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
  getAbnormalApp,
} from '../controllers/applications'

const router = new Router()

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

router
  .use(parseBody)
  .use(decodeToken)
  .prefix('/ai/v1/')
  // 申请审批资源
  .post('/apply', applyRes)
  .get('/apply', getApply) // 获取审批资源
  .get('/applyhis', getApplyHis) // 获取审批资源，用于管理员审核
  .put('/apply', updateApply) // 获取审批资源

  // 节点&资源
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
  .post('/batch-remove-menu', batchRemoveMenu)

  // 上传文件
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
  .get('/abnormal-app', getAbnormalApp)

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

  // 获取告警消息
  .get('/alert-message', getAlertMessage)
  .post('/alert-message', updateAlertMessage)

export default router
