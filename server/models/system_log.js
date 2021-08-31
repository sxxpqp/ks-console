module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'system_log',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '节点id',
      },
      cpu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'cpu使用率',
      },
      mem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '内存使用',
      },
      disk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '硬盘使用',
      },
      network: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '网络占用情况',
      },
    },
    {
      sequelize,
      tableName: 'system_log',
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
