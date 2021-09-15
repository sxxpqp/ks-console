const { Op, fn, col } = require('sequelize')

// 查询节点资源的已经使用的情况
module.exports = node => {
  let whereState = {
    nid: {
      [Op.not]: null,
    },
  }
  if (node) {
    whereState = {
      nid: {
        [Op.not]: null,
        [Op.eq]: parseInt(node, 10),
      },
    }
  }
  return global.models.resources.findAll({
    attributes: [
      [fn('SUM', col('cpu')), 'cpuUsage'],
      [fn('SUM', col('mem')), 'memUsage'],
      [fn('SUM', col('disk')), 'diskUsage'],
      [fn('SUM', col('gpu')), 'gpuUsage'],
      'nid',
    ],
    where: whereState,
    group: ['nid'],
    // group: ['cpu', 'mem', 'gpu', 'disk', 'nid'],
  })
}
