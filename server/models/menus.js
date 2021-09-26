module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'menus',
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
        comment: '菜单名称',
      },
      pid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '父级菜单',
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '菜单类型，0-目录，1-菜单，2-链接',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否禁用，0-未禁用，1-禁用',
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '菜单地址',
      },
      route: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '路由',
      },
      icon: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '菜单图标',
      },
      sort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '排序',
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '说明',
      },
      other: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '其他配置',
      },
    },
    {
      sequelize,
      tableName: 'menus',
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
