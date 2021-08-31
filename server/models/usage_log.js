module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'usage_log',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '节点id',
        references: {
          model: 'nodes',
          key: 'id',
        },
      },
      cpu: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'cpu使用率',
      },
      mem: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '内存使用',
      },
      disk: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '磁盘使用',
      },
    },
    {
      sequelize,
      tableName: 'usage_log',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'fk_usage_log_nodes_1',
          using: 'BTREE',
          fields: [{ name: 'nid' }],
        },
      ],
    }
  )
}
