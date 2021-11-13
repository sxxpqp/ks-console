const { Sequelize } = require('sequelize')

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'groups_nodes',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      gid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '组id',
        references: {
          model: 'groups',
          key: 'id',
        },
      },
      machine: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '节点id',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      sequelize,
      tableName: 'groups_nodes',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'ng_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'gid' }, { name: 'machine' }],
        },
      ],
    }
  )
}
