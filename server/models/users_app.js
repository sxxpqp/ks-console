module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define(
    'users_app',
    {
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '应用名称',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '状态',
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '分类，0-模板，1-自制',
      },
      appId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        comment: 'appId',
      },
      created: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      updated: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '更新时间',
      },
      deployments: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '负载数量',
      },
      services: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '服务数量',
      },
      meta: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'meta信息',
      },
      namespace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '命名空间',
      },
      workspace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '工作空间',
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users_app',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'appId' }],
        },
        {
          name: 'appId_index',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'appId' }],
        },
      ],
    }
  )
  // model.removeAttribute('id')
  return model
}
