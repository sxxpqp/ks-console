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
      isAdmin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否是组管理员',
      },
      cluster: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '集群',
      },
      workspace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '工作空间',
      },
      namespace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '项目名称',
      },
      devops: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'devops名称',
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
