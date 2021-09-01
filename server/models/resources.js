const { Sequelize } = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'resources',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      cpu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'cpu',
      },
      mem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '内存',
      },
      disk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '磁盘',
      },
      gpu: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'gpu',
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '申请原因',
      },
      nid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '标签，关联节点id',
        references: {
          model: 'nodes',
          key: 'id',
        },
      },
      networks: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '网络',
      },
      auditorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '审核员id',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '状态：0-未审核，1-已审核，2-驳回',
      },
      msg: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '审核消息',
      },
      app: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '应用配置',
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '部署方式：0-不限，1-优先自有，2-仅自有',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        comment: '创建时间',
      },
      updated: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '更新时间',
      },
    },
    {
      sequelize,
      tableName: 'resources',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'fk_resources_nodes_1',
          using: 'BTREE',
          fields: [{ name: 'nid' }],
        },
        {
          name: 'fk_resources_users_1',
          using: 'BTREE',
          fields: [{ name: 'uid' }],
        },
      ],
    }
  )
}
