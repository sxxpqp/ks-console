const { Sequelize } = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define(
    'nodes',
    {
      node: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '节点系统名称',
      },
      machine: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        comment: '节点uid',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '节点别名',
      },
      cpu: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: false,
        comment: '总CPU资源',
      },
      mem: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '总内存资源',
      },
      disk: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '总磁盘资源',
      },
      gpu: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: false,
        defaultValue: 0,
        comment: '总GPU资源',
      },
      inode: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: true,
        comment: 'inode总',
      },
      pod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '总容器数',
      },
      ip: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'ip信息',
        unique: 'ip_unique',
      },
      nodePorts: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '可使用的端口',
      },
      status: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: '0',
        comment: '0-可分配，1-不可分配',
      },
      sshPort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ssh端口',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '密码',
      },
      cert: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'ssh密钥',
      },
      taints: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cpu_used: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: true,
        comment: 'cpu使用',
      },
      mem_used: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: true,
        comment: '内存使用',
      },
      disk_used: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: true,
        comment: '磁盘使用',
      },
      gpu_used: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: true,
        comment: 'GPU使用',
      },
      inode_used: {
        type: DataTypes.DECIMAL(64, 2),
        allowNull: true,
        comment: '已使用inode',
      },
      pod_used: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '已运行pod数量',
      },
      cpu_limit: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: 'cpu资源限制',
      },
      cpu_request: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: 'cpu资源预留',
      },
      mem_limit: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '内存资源限制',
      },
      mem_request: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '内存资源预留',
      },
      conditions: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '网络配置、内存压力、磁盘压力、进程压力、容器组接收',
      },
      updated: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      role: {
        type: DataTypes.STRING(32),
        allowNull: true,
        comment: '角色',
      },
    },
    {
      sequelize,
      tableName: 'nodes',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'machine' }],
        },
        {
          name: 'ip_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'ip' }],
        },
      ],
    }
  )
  model.removeAttribute('id')
  return model
}
