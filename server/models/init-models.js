const DataTypes = require('sequelize').DataTypes
const _applications = require('./applications')
const _groups = require('./groups')
const _groups_nodes = require('./groups_nodes')
const _menus = require('./menus')
const _nodes = require('./nodes')
const _nodes_log = require('./nodes_log')
const _operations_log = require('./operations_log')
const _resources = require('./resources')
const _resources_template = require('./resources_template')
const _rights = require('./rights')
const _role = require('./role')
const _role_rights = require('./role_rights')
const _users = require('./users')
const _users_group = require('./users_group')
const _users_role = require('./users_role')
const _users_app = require('./users_app')
const _app_detail = require('./app_detail')
const _app_labels = require('./app_labels')
const _labels = require('./labels')

// 在Sequelize中建立关联关系，通过调用模型(源模型)的belongsTo、hasOne、hasMany、belongsToMany方法，再将要建立关系的模型(目标模型)做为参数传入即可。这些方法会按以下规则创建关联关系：

// hasOne - 与目标模型建立1:1关联关系，关联关系(外键)存在于目标模型中。详见：Model.hasOne()
// belongsTo - 与目标模型建立1:1关联关系，关联关系(外键)存在于源模型中。详见：Model.belongsTo()
// hasMany - 与目标模型建立1:N关联关系，关联关系(外键)存在于目标模型中。详见：Model.hasMany()
// belongsToMany - 与目标模型建立N:M关联关系，会通过sourceId和targetId创建交叉表。详见：Model.belongsToMany()
function initModels(sequelize) {
  sequelize.addHook('beforeCount', function(options) {
    if (this._scope.include && this._scope.include.length > 0) {
      options.distinct = true
      options.col =
        this._scope.col || options.col || `"${this.options.name.singular}".id`
    }

    if (options.include && options.include.length > 0) {
      options.include = null
    }
  })
  const applications = _applications(sequelize, DataTypes)
  const groups = _groups(sequelize, DataTypes)
  const groups_nodes = _groups_nodes(sequelize, DataTypes)
  const menus = _menus(sequelize, DataTypes)
  const nodes = _nodes(sequelize, DataTypes)
  const nodes_log = _nodes_log(sequelize, DataTypes)
  const operations_log = _operations_log(sequelize, DataTypes)
  const resources = _resources(sequelize, DataTypes)
  const resources_template = _resources_template(sequelize, DataTypes)
  const rights = _rights(sequelize, DataTypes)
  const role = _role(sequelize, DataTypes)
  const role_rights = _role_rights(sequelize, DataTypes)
  const users = _users(sequelize, DataTypes)
  const users_group = _users_group(sequelize, DataTypes)
  const users_role = _users_role(sequelize, DataTypes)
  const users_app = _users_app(sequelize, DataTypes)
  const app_detail = _app_detail(sequelize, DataTypes)
  const app_labels = _app_labels(sequelize, DataTypes)
  const labels = _labels(sequelize, DataTypes)

  // resources_applications.belongsTo(applications, {
  //   as: 'aid_application',
  //   foreignKey: 'aid',
  // })
  // applications.hasMany(resources_applications, {
  //   as: 'resources_applications',
  //   foreignKey: 'aid',
  // })
  // users_group.belongsTo(groups, { as: 'gid_group', foreignKey: 'gid' })
  // groups.hasMany(users_group, { as: 'users_groups', foreignKey: 'gid' })
  // resources_applications.belongsTo(resources, {
  //   as: 'rid_resource',
  //   foreignKey: 'rid',
  // })
  // resources.hasMany(resources_applications, {
  //   as: 'resources_applications',
  //   foreignKey: 'rid',
  // })
  // role_rights.belongsTo(rights, { as: 'right', foreignKey: 'rightsId' })
  // rights.hasMany(role_rights, { as: 'role_rights', foreignKey: 'rightsId' })
  // users_role.belongsTo(role, { as: 'role', foreignKey: 'roleId' })
  // role.hasMany(users_role, { as: 'users_roles', foreignKey: 'roleId' })
  // resources.belongsTo(users, { as: 'uid_user', foreignKey: 'uid' })
  // users.hasMany(resources, { as: 'resources', foreignKey: 'uid' })
  // users_group.belongsTo(users, { as: 'uid_user', foreignKey: 'uid' })
  // users.hasMany(users_group, { as: 'users_groups', foreignKey: 'uid' })

  // 节点与节点日志的对应关系
  nodes.hasMany(nodes_log, { sourceKey: 'machine', foreignKey: 'machine' })
  nodes.hasOne(groups_nodes, { sourceKey: 'machine', foreignKey: 'machine' })

  nodes_log.belongsTo(nodes, { sourceKey: 'machine', foreignKey: 'machine' })
  groups_nodes.belongsTo(nodes, { sourceKey: 'machine', foreignKey: 'machine' })

  groups.hasMany(groups_nodes, { sourceKey: 'id', foreignKey: 'gid' })
  // gid与groups中是一对一的关系
  groups_nodes.hasOne(groups, {
    sourceKey: 'gid',
    foreignKey: 'id',
  })

  // 用户与角色的关系
  users.hasMany(users_role, { sourceKey: 'id', foreignKey: 'uid' })
  users_role.hasOne(role, { sourceKey: 'roleId', foreignKey: 'id' })

  // 用户与组的对应关系
  users.hasMany(users_group, { sourceKey: 'id', foreignKey: 'uid' })
  users_group.belongsTo(users, { sourceKey: 'uid', foreignKey: 'id' })
  users_group.hasOne(groups, { sourceKey: 'gid', foreignKey: 'id' })

  // 用户与申请资源的关系
  users.hasMany(resources, { sourceKey: 'id', foreignKey: 'uid' })
  resources.hasOne(users, { sourceKey: 'uid', foreignKey: 'id' })

  // 应用与标签的关系
  users_app.hasMany(app_labels, { sourceKey: 'appId', foreignKey: 'appId' })
  app_labels.belongsTo(users_app, { sourceKey: 'appId', foreignKey: 'appId' })

  app_labels.hasOne(labels, { sourceKey: 'tagId', foreignKey: 'id' })
  labels.hasMany(app_labels, { sourceKey: 'id', foreignKey: 'tagId' })

  return {
    applications,
    groups,
    groups_nodes,
    menus,
    nodes,
    nodes_log,
    operations_log,
    resources,
    resources_template,
    rights,
    role,
    role_rights,
    users,
    users_group,
    users_role,
    users_app,
    app_detail,
    app_labels,
    labels,
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
