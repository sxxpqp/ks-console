const { get } = require('lodash')
const yaml = require('js-yaml')
const { sshInit } = require('@/services/ssh')

// 执行sshcmd的命令，并解析yaml文件
// flag: false-解析yaml， true-不解析yaml直接返回cmd的实例
export const sshcmd = async (cmd, options = {}, flag = false) => {
  try {
    const sshClient = await sshInit(options)
    const containerCmd = await sshClient.execCommand(cmd, {
      cwd: '/',
    })
    const doc = flag ? yaml.load(containerCmd.stdout, 'utf-8') : containerCmd
    return doc
  } catch (error) {
    global.logError.error(`ssh connect error: ${error}`)
  }
}

export const kubctl = async (info, options = {}) => {
  try {
    const { podName, namespace } = info
    const cmd = `kubectl get pod ${podName} -o yaml -n ${namespace}`
    const doc = await sshcmd(cmd, options, true)
    return get(doc, 'spec.containers')
  } catch (error) {
    global.logError.error(`ssh kubctl error: ${error}`)
  }
}

export const getImage = async (info, options = {}) => {
  try {
    const { container, podName, namespace } = info
    const res = await sshcmd(
      `docker ps | grep ${container}_${podName}_${namespace}| grep -v pause |awk '{print $1}'`,
      options
    )
    return res.stdout
  } catch (error) {
    global.logError.error(`ssh getImage error: ${error}`)
  }
}

// docker login & push
// hubInfo为容器的连接信息，用户名username，用户密码password，容器url
// imageInfo为镜像的名称 image名称 标签tag
// options为ssh连接信息
export const imagePush = async ({ hubInfo, imageInfo }, options = {}) => {
  try {
    const { image } = imageInfo
    const tag = imageInfo.tag || 'latest'
    const { username, password, url } = hubInfo
    await sshcmd(`docker login -u${username} -p${password} ${url}`, options)
    const pushRes = await sshcmd(`docker push ${image}:${tag}`, options)
    return pushRes
  } catch (error) {
    global.logError.error(`ssh imagePush error: ${error}`)
  }
}

// 镜像commit
export const imageCommit = async (
  { hubInfo, imageInfo, info },
  options = {}
) => {
  try {
    const { containerId } = imageInfo
    const imageName =
      imageName || `${hubInfo.url}/${info.podName}_${info.namespace}`
    const res = await sshcmd(
      `docker commit ${containerId} ${imageName}`,
      options
    )
    return res
  } catch (error) {
    global.logError.error(`ssh imageCommit error: ${error}`)
  }
}
