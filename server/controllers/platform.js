export const applyRes = async ctx => {
  const { body } = ctx.request
  const { resources } = global.models
  // const res = await models.resources.findAll()
  // console.log('🚀 ~ file: platform.js ~ line 6 ~ res', res)
  const { uid, cpu, mem, gpu, disk, reason, type } = body
  const res = await resources.create({
    uid: parseInt(uid, 10),
    cpu: parseInt(cpu, 10),
    mem: parseInt(mem, 10),
    gpu: parseInt(gpu, 10),
    disk: parseInt(disk, 10),
    type,
    reason,
  })
  ctx.body = {
    code: 200,
    data: res,
  }
}
