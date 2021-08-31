module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: '用户表ID',
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '邮箱，登录名',
        unique: 'username_unique',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mobile: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '手机号',
        unique: 'mobile_unique',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否禁用',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '创建时间',
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '上次登录时间',
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '登录次数',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'mobile_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'mobile' }],
        },
        {
          name: 'username_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'username' }],
        },
      ],
    }
  )
}
