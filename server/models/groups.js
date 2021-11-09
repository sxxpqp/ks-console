const Sequelize = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'groups',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: '组id',
      },
      code: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '编码',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '级名称',
      },
      desc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '简称',
      },
      pid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: -1,
        comment: '父级',
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '0-企业&组织，1-部门',
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 100,
        comment: '排序',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      sequelize,
      tableName: 'groups',
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
