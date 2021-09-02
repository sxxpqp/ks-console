/* eslint-disable prefer-rest-params */
const { Sequelize } = require('sequelize')
const SequelizeModel = require('sequelize/lib/model')
const mysql2 = require('mysql2')

const orgFindAll = SequelizeModel.findAll
const orgCreate = SequelizeModel.create

const dbError = err => {
  // eslint-disable-next-line no-console
  console.log('sequelize err...', err)
  global.logError.error(err)
}

SequelizeModel.findAll = function() {
  return orgFindAll.apply(this, arguments).catch(err => {
    dbError(err)
  })
}
SequelizeModel.create = function() {
  return orgCreate.apply(this, arguments).catch(err => {
    dbError(err)
  })
}

const sequelize = ({ db, user, password, host, port }) => {
  const instance = new Sequelize(db, user, password, {
    host,
    port,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false, // 关闭日志
    typeValidation: true,
    timezone: '+08:00',
    pool: {
      max: 50,
      idle: 30000,
      acquire: 60000,
    },
    retry: {
      max: 0,
    },
  })
  // instance.authenticate().then(() => {
  //   console.log('数据库连接成功')
  // })

  instance.query = function() {
    return Sequelize.prototype.query.apply(this, arguments).catch(err => {
      dbError(err)
    })
  }

  return instance
}

module.exports = {
  sequelize,
}
