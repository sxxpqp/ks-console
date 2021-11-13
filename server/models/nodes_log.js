const Sequelize = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define(
    'nodes_log',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        comment: '表id',
      },
      machine: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        comment: 'node的uid信息',
        references: {
          model: 'nodes',
          key: 'machine',
        },
      },
      net_health: {
        type: DataTypes.STRING(16),
        allowNull: true,
        comment: '网络健康',
      },
      mem_health: {
        type: DataTypes.STRING(16),
        allowNull: true,
        comment: '内存健康',
      },
      disk_pressure: {
        type: DataTypes.STRING(16),
        allowNull: true,
        comment: '磁盘压力',
      },
      pid_pressure: {
        type: DataTypes.STRING(16),
        allowNull: true,
        comment: '进程压力',
      },
      pod_ready: {
        type: DataTypes.STRING(16),
        allowNull: true,
        comment: '容器接收',
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
      pod_used: {
        type: DataTypes.INTEGER,
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
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      meta: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'meta信息',
      },
    },
    {
      sequelize,
      tableName: 'nodes_log',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
      ],
    },
    {
      sequelize,
      tableName: 'nodes_log',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }, { name: 'machine' }],
        },
      ],
    }
  )
  // model.removeAttribute('id')
  return model
}
