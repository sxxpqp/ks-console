module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define(
    'app_detail',
    {
      app: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        comment: '类型',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
        comment: '名称',
      },
      meta: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'meta信息',
      },
    },
    {
      sequelize,
      tableName: 'app_detail',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'app' }, { name: 'name' }, { name: 'type' }],
        },
      ],
    }
  )
  // model.removeAttribute('id')
  return model
}
