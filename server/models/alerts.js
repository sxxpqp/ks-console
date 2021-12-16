const Sequelize = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'alerts',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true,
      },
      msg: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '告警消息',
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '0-资源告警，1-容器异常',
      },
      status: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '未触发，待触发，触发中',
      },
      level: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '危险告警，重要告警，一般告警',
      },
      rule: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '告警策略',
      },
      created: {
        type: DataTypes.DATE(6),
        allowNull: true,
        comment: '创建时间',
        defaultValue: Sequelize.NOW,
      },
      read: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '是否已读，0-未读，1-已读',
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '接收消息的用户',
      },
      workspace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '工作空间',
      },
      namespace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '用户项目',
      },
      app: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '关联应用',
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      meta: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: '接口数据',
      },
    },
    {
      sequelize,
      tableName: 'alerts',
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
