module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'labels',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '标签名称',
      },
      icon: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '标签图标',
      },
      color: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '标签颜色',
      },
    },
    {
      sequelize,
      tableName: 'labels',
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
