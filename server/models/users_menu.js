module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'users_menu',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户id',
      },
      mid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '菜单id',
      },
    },
    {
      sequelize,
      tableName: 'users_menu',
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
