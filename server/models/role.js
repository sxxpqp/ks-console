const { Sequelize } = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'role',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '角色名称',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '创建时间',
        defaultValue: Sequelize.NOW,
      },
      pid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '父角色id',
        defaultValue: 0,
      },
      desc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '角色描述',
      },
    },
    {
      sequelize,
      tableName: 'role',
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
