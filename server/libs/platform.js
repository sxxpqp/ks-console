const { get } = require('lodash')
const yaml = require('js-yaml')
const compressing = require('compressing')
const path = require('path')
const { ftpsInit } = require('@/services/ftps')
const { sshInit } = require('@/services/ssh')
const { getServerConfig } = require('@/libs/utils')

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

export const unzipFile = async (source, target) => {
  try {
    await compressing.zip.uncompress(source, target)
  } catch (error) {
    global.logError.error(`unzip error: ${error}`)
  }
}

export const cpFileToPath = async (info, options = {}) => {
  // 只传filePath直接复制到tmp
  const { node, containerID, filePath, destPath, fileName, ext, name } = info
  try {
    const serverConfig = getServerConfig().server
    const { nodeInfo } = serverConfig
    const dest = '/tmp'
    // fileName - 临时文件名 uuidv4
    // destPath - 是node目录，目前没有用，直接传到tmp
    let cmd = `docker cp ${dest}/${fileName} ${containerID}:${dest}/${name}`
    const sshOptions = {
      ...options,
      host: node,
      username: nodeInfo.username || 'root',
      password: nodeInfo.password || 'root',
      port: nodeInfo.port || 22,
    }
    // 使用ftp从server的文件目录传到node的目录
    await new Promise((resolve, reject) => {
      ftpsInit(sshOptions)
        .cd(dest)
        .put(filePath)
        .exec(function(err, res) {
          // err will be null (to respect async convention)
          // res is an hash with { error: stderr || null, data: stdout }
          if (err || res.error) {
            global.logError.error(`sftp error: ${err}`)
            reject(err)
          }
          resolve(res)
        })
    })
    let basename = fileName
    if (ext === '.zip') {
      await sshcmd(cmd, sshOptions)
      // 需要解压unzip
      basename = path.basename(fileName, '.zip')
      const zipName = path.basename(name, '.zip')
      await sshcmd(
        `unzip ${dest}/${fileName} -d ${dest}/${basename}`,
        sshOptions
      )
      const tmpDest = destPath || `${dest}/${zipName}/`
      cmd = `docker cp ${dest}/${basename}/ ${containerID}:${tmpDest}`
    }
    const res = await sshcmd(cmd, sshOptions)
    // 删除文件与目录
    await sshcmd(`rm -rf ${dest}/${basename}*`, sshOptions)
    return res
  } catch (error) {
    global.logError.error(`ssh cpFileToPath error: ${error}`)
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
    // 读取默认公共仓库
    const { harbor } = global.server
    const username = hubInfo.username || harbor.username
    const password = hubInfo.password || harbor.password
    const url = hubInfo.url || harbor.url
    // await sshcmd(`docker login -u${username} -p${password} ${url}`, options)
    // 镜像名称
    const imageUrl = imageInfo.imageUrl || `${harbor.url}/${harbor.repo}`
    const tag = imageInfo.tag || 'latest'
    const imageName = `${imageUrl}/${imageInfo.name}:${tag}`
    const pushRes = await sshcmd(
      `docker login -u${username} -p${password} ${url} && docker push ${imageName}`,
      options
    )
    return { image: imageName, res: pushRes }
  } catch (error) {
    global.logError.error(`ssh imagePush error: ${error}`)
  }
}

// 镜像commit
export const imageCommit = async (
  { imageInfo, containerID, ...info },
  options = {}
) => {
  try {
    const { harbor } = global.server
    const url = imageInfo.imageUrl || `${harbor.url}/${harbor.repo}`
    const imageName = imageInfo.name
      ? `${url}/${imageInfo.name}:${imageInfo.tag}`
      : `${url}/${info.podName}_${info.namespace}`
    const res = await sshcmd(
      `docker commit ${containerID} ${imageName}`,
      options
    )
    return { imageName, res }
  } catch (error) {
    global.logError.error(`ssh imageCommit error: ${error}`)
  }
}
