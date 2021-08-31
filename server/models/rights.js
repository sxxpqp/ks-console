module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'rights',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: '权限id',
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '权限类型 0-菜单，1-接口',
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '菜单或者接口路径',
      },
      method: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '请求方法',
      },
    },
    {
      sequelize,
      tableName: 'rights',
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
