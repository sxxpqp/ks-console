const Sequelize = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: '用户表ID',
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '登录名',
        unique: 'username_unique',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '用户邮箱',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mobile: {
        type: DataTypes.STRING(11),
        allowNull: true,
        comment: '手机号',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '是否禁用',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '创建时间',
        default: Sequelize.NOW,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '上次登录时间',
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '登录次数',
      },
      namespace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '空间',
      },
      cluster: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '集群',
      },
      workspace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '工作空间',
      },
      harborPass: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'harbor密码',
      },
      harborId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'harborId',
      },
      harborPid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'harbor项目id，仓库id',
      },
      devops: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'devops名称',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'username_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'username' }],
        },
      ],
    }
  )
}
