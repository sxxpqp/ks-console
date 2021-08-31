module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'groups',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: '组id',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '级名称',
      },
      pid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '父级',
      },
    },
    {
      sequelize,
      tableName: 'groups',
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
