module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'app_labels',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      appId: {
        type: DataTypes.STRING(0),
        allowNull: false,
        comment: '应用id',
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'tagId，对应labels',
      },
    },
    {
      sequelize,
      tableName: 'app_labels',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'app_tags_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'appId' }, { name: 'tagId' }],
        },
      ],
    }
  )
}
