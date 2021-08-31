module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'applications',
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
        comment: '应用名称',
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '镜像名称',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '应用状态 0-创建中，1-运行，2-失败',
      },
      version: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '版本',
      },
      port: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '服务端口',
      },
      nodePort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '对外端口',
      },
      created: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '创建时间',
      },
      updated: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: '更新时间',
      },
      num: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '副本数量',
      },
      config: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '配置文件',
      },
      namespace: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'k8s命名空间',
      },
      project: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'k8s项目',
      },
      cpuLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'cpu限制',
      },
      memLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '内存限制',
      },
      gpuLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'gpu限制',
      },
      diskLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '硬盘限制',
      },
    },
    {
      sequelize,
      tableName: 'applications',
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
