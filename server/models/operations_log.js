module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'operations_log',
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
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '操作类型',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '状态码',
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '请求路径',
      },
      methods: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: '请求方法',
      },
      params: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '请求参数',
      },
      return: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '返回参数',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '创建时间',
      },
    },
    {
      sequelize,
      tableName: 'operations_log',
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
