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
      machine: {
        type: DataTypes.STRING(36),
        allowNull: true,
        comment: '节点machineID',
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
      created: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true,
        comment: '创建时间',
      },
      updated: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '更新时间',
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
      ],
    }
  )
}
