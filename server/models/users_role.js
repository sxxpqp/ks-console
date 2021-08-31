module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'users_role',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户id',
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '角色id',
        references: {
          model: 'role',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'users_role',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'fk_users_role_role_1',
          using: 'BTREE',
          fields: [{ name: 'roleId' }],
        },
      ],
    }
  )
}
