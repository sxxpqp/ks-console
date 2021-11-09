const DataTypes = require('sequelize').DataTypes
const _applications = require('./applications')
const _groups = require('./groups')
const _menus = require('./menus')
const _nodes = require('./nodes')
const _operations_log = require('./operations_log')
const _resources = require('./resources')
const _resources_applications = require('./resources_applications')
const _rights = require('./rights')
const _role = require('./role')
const _role_rights = require('./role_rights')
const _system_log = require('./system_log')
const _usage_log = require('./usage_log')
const _users = require('./users')
const _users_group = require('./users_group')
const _users_role = require('./users_role')
const _users_app = require('./users_app')
const _app_detail = require('./app_detail')

function initModels(sequelize) {
  const applications = _applications(sequelize, DataTypes)
  const groups = _groups(sequelize, DataTypes)
  const menus = _menus(sequelize, DataTypes)
  const nodes = _nodes(sequelize, DataTypes)
  const operations_log = _operations_log(sequelize, DataTypes)
  const resources = _resources(sequelize, DataTypes)
  const resources_applications = _resources_applications(sequelize, DataTypes)
  const rights = _rights(sequelize, DataTypes)
  const role = _role(sequelize, DataTypes)
  const role_rights = _role_rights(sequelize, DataTypes)
  const system_log = _system_log(sequelize, DataTypes)
  const usage_log = _usage_log(sequelize, DataTypes)
  const users = _users(sequelize, DataTypes)
  const users_group = _users_group(sequelize, DataTypes)
  const users_role = _users_role(sequelize, DataTypes)
  const users_app = _users_app(sequelize, DataTypes)
  const app_detail = _app_detail(sequelize, DataTypes)

  resources_applications.belongsTo(applications, {
    as: 'aid_application',
    foreignKey: 'aid',
  })
  applications.hasMany(resources_applications, {
    as: 'resources_applications',
    foreignKey: 'aid',
  })
  users_group.belongsTo(groups, { as: 'gid_group', foreignKey: 'gid' })
  groups.hasMany(users_group, { as: 'users_groups', foreignKey: 'gid' })
  resources.belongsTo(nodes, { as: 'nid_node', foreignKey: 'nid' })
  nodes.hasMany(resources, { as: 'resources', foreignKey: 'nid' })
  usage_log.belongsTo(nodes, { as: 'nid_node', foreignKey: 'nid' })
  nodes.hasMany(usage_log, { as: 'usage_logs', foreignKey: 'nid' })
  resources_applications.belongsTo(resources, {
    as: 'rid_resource',
    foreignKey: 'rid',
  })
  resources.hasMany(resources_applications, {
    as: 'resources_applications',
    foreignKey: 'rid',
  })
  role_rights.belongsTo(rights, { as: 'right', foreignKey: 'rightsId' })
  rights.hasMany(role_rights, { as: 'role_rights', foreignKey: 'rightsId' })
  users_role.belongsTo(role, { as: 'role', foreignKey: 'roleId' })
  role.hasMany(users_role, { as: 'users_roles', foreignKey: 'roleId' })
  resources.belongsTo(users, { as: 'uid_user', foreignKey: 'uid' })
  users.hasMany(resources, { as: 'resources', foreignKey: 'uid' })
  users_group.belongsTo(users, { as: 'uid_user', foreignKey: 'uid' })
  users.hasMany(users_group, { as: 'users_groups', foreignKey: 'uid' })

  return {
    applications,
    groups,
    menus,
    nodes,
    operations_log,
    resources,
    resources_applications,
    rights,
    role,
    role_rights,
    system_log,
    usage_log,
    users,
    users_group,
    users_role,
    users_app,
    app_detail,
  }
}
module.exports = initModels
module.exports.initModels = initModels
module.exports.default = initModels
