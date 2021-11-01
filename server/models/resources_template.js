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
        allowNull: false,
        defaultValue: 0,
        comment: 'CPU',
      },
      mem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '内存GiB',
      },
      disk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '磁盘GiB',
      },
      gpu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'GPU',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '创建时间',
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
