const { Sequelize } = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'resources_template',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '配置别名',
      },
      cpu: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'CPU',
      },
      mem: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '内存GiB',
      },
      disk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '磁盘GB',
      },
      gpu: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'GPU',
      },
      desc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '配置说明',
      },
      app: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '推荐应用',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '创建时间',
        defaultValue: Sequelize.NOW,
      },
    },
    {
      sequelize,
      tableName: 'resources_template',
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
