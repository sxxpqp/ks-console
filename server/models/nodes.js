module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'nodes',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      node: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '节点名称',
      },
      label: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '节点标签',
      },
      cpu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '总CPU资源',
      },
      mem: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总内存资源',
      },
      disk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总磁盘资源',
      },
      gpu: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '总GPU资源',
      },
      ip: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'ip信息',
        unique: 'ip_unique',
      },
      nodePorts: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '可使用的端口',
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '0-可分配，1-不可分配',
      },
      sshPort: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ssh端口',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '密码',
      },
      cert: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'ssh密钥',
      },
      remark: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '节点别名',
      },
    },
    {
      sequelize,
      tableName: 'nodes',
      timestamps: false,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }],
        },
        {
          name: 'ip_unique',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'ip' }],
        },
      ],
    }
  )
}
