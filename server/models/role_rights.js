module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'role_rights',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '角色id',
      },
      rightsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '权限id',
        references: {
          model: 'rights',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'role_rights',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'fk_role_rights_rights_1',
          using: 'BTREE',
          fields: [{ name: 'rightsId' }],
        },
      ],
    }
  )
}
