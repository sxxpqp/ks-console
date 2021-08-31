module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'resources_applications',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      rid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '资源id',
        references: {
          model: 'resources',
          key: 'id',
        },
      },
      aid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '应用id',
        references: {
          model: 'applications',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'resources_applications',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'fk_resources_applications_resources_1',
          using: 'BTREE',
          fields: [{ name: 'rid' }],
        },
        {
          name: 'fk_resources_applications_applications_1',
          using: 'BTREE',
          fields: [{ name: 'aid' }],
        },
      ],
    }
  )
}
