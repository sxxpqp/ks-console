module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'users_group',
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
        references: {
          model: 'users',
          key: 'id',
        },
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
    },
    {
      sequelize,
      tableName: 'users_group',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'fk_users_group_users_1',
          using: 'BTREE',
          fields: [{ name: 'uid' }],
        },
        {
          name: 'fk_users_group_groups_1',
          using: 'BTREE',
          fields: [{ name: 'gid' }],
        },
      ],
    }
  )
}
