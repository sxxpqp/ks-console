import fs from 'fs'
import yaml from 'js-yaml/dist/js-yaml'
import NodeCache from 'node-cache'
import get from 'lodash/get'
import merge from 'lodash/merge'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import generate from 'nanoid/generate'

export const MANIFEST_CACHE_KEY_PREFIX = 'MANIFEST_CACHE_KEY_'
export const LOCALE_MANIFEST_CACHE_KEY = 'LOCALE_MANIFEST_CACHE_KEY'

export const root = dir => `${global.APP_ROOT}/${dir}`.replace(/(\/+)/g, '/')

export const cache = global._pitrixCache || new NodeCache()
if (!global._pitrixCache) {
  global._pitrixCache = cache
}

export const server_conf_key = 'pitrix-server-conf-key'

/**
 *
 * @param filePath
 * @returns {*} json formatted content
 */
export const loadYaml = filePath => {
  try {
    return yaml.safeLoad(fs.readFileSync(filePath), 'utf8')
  } catch (e) {
    return false
  }
}

/**
 * get server side configuration
 *
 * @returns {*|{}}
 */
export const getServerConfig = key => {
  let config = cache.get(server_conf_key)
  if (!config) {
    // parse config yaml
    // config = loadYaml(root('server/config.yaml')) || {}
    config = {}
    const tryFile = root('server/local_config.yaml')
    // ai-platform 不需要merge，直接使用全量配置
    if (fs.existsSync(tryFile)) {
      // merge local_config
      const local_config = loadYaml(tryFile)
      if (typeof local_config === 'object') {
        merge(config, local_config)
      }
    } else {
      config = loadYaml(root('server/config.yaml'))
    }

    cache.set(server_conf_key, config)
  }
  return key ? config[key] : config
}

export const getCache = () => cache

export const isValidReferer = path =>
  !isEmpty(path) && path !== '/' && path.indexOf('/login') === -1

/**
 *
 * @param path  koa ctx.path
 */
export const isAppsRoute = path => {
  return path === '/apps' || /^\/apps\/?(app-([-0-9a-z]*)\/?)?$/.exec(path)
}

/**
 *
    encrypt algorithm:
    1. read salt from template variable.
    2. base64 encode raw password, and use it as str to encrypt.
    3. keep salt.length >= str.length.
       if it does not match, salt += str.slice(0, str.length - salt.length)
    4. mix salt and str letter by letter, take the average character code of these two string.
       if str.length < salt.length, use character '@' to mix salt letter
    5. convert the average codes to letters and join them into a new string.
    6. since the average code may not be an interger, there is prefix in the new string.
       the prefix is a bitmap converted by base64(parseInt(bitmap, 2))
    7. encrypted one is constructed with prefix + '@' + new string.
 */

export const decryptPassword = (encrypted, salt) => {
  const specialToken = '@'
  const specialIndex = encrypted.indexOf(specialToken)
  if (specialIndex === -1 || !salt) {
    return encrypted
  }

  const prefix = encrypted.slice(0, specialIndex)
  const pure = encrypted.slice(specialIndex + specialToken.length)
  const signs = Buffer.from(prefix, 'base64').toString('utf-8')

  let index = 0
  let b64 = ''

  for (const letter of pure) {
    const todel = index < salt.length ? salt[index] : b64[index - salt.length]
    let code = letter.charCodeAt(0) * 2 - todel.charCodeAt(0)
    if (signs[index] === '1') {
      code += 1
    }
    if (code !== 64) {
      b64 += String.fromCharCode(code)
    }
    index++
  }

  return Buffer.from(b64, 'base64').toString('utf-8')
}

export const safeParseJSON = (json, defaultValue) => {
  let result
  try {
    result = JSON.parse(json)
  } catch (e) {}

  if (!result && defaultValue !== undefined) {
    return defaultValue
  }
  return result
}

export const getManifest = entry => {
  let manifestCache = cache.get(`${MANIFEST_CACHE_KEY_PREFIX}${entry}`)

  if (!manifestCache) {
    let data = {}
    try {
      const dataStream = fs.readFileSync(root('dist/manifest.json'))
      data = safeParseJSON(dataStream.toString(), {})
    } catch (error) {}
    manifestCache = get(data, `entrypoints.${entry}`)
    cache.set(`${MANIFEST_CACHE_KEY_PREFIX}${entry}`, manifestCache)
  }

  return manifestCache
}

export const getLocaleManifest = () => {
  let manifestCache = cache.get(LOCALE_MANIFEST_CACHE_KEY)

  if (!manifestCache) {
    let data = {}
    try {
      const dataStream = fs.readFileSync(root('dist/manifest.locale.json'))
      data = safeParseJSON(dataStream.toString(), {})
    } catch (error) {}
    manifestCache = pick(
      data,
      Object.keys(data).filter(key => key.startsWith('locale-'))
    )
    cache.set(LOCALE_MANIFEST_CACHE_KEY, manifestCache)
  }

  return manifestCache
}

export const firstUpperCase = str => `${str[0].toUpperCase()}${str.slice(1)}`

export const generateId = (length, flag = false) => {
  const res = generate('0123456789abcdefghijklmnopqrstuvwxyz', length - 1 || 5)
  const baseStr = 'abcdefghijklmnopqrstuvwxyz'
  const firstStr = baseStr[Math.floor(Math.random() * baseStr.length)]
  if (flag) {
    const result = `${firstStr}${res}`.replace(/^\S/, s => s.toUpperCase())
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(result)
      ? result
      : generateId(length < 8 ? 8 : length, flag)
  }
  return `${firstStr}${res}`
}

// 获得所有父级Id
export const getAllPids = (tree, id) => {
  const arr = []
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      if (tree[i].pid !== -1) {
        arr.push(...getAllPids(tree, tree[i].pid))
      } else {
        arr.push(tree[i].id)
      }
    }
  }
  return arr
}

// 获得所有子级Id
export const getAllChildIds = (tree, id) => {
  const arr = []
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].pid === id) {
      arr.push(tree[i].id)
      arr.push(...getAllChildIds(tree, tree[i].id))
    }
  }
  return arr
}

// 获取根级group
export const getRootGroup = (tree, id) => {
  let group = tree.find(item => item.id === id)
  if (group.pid !== -1) {
    group = getRootGroup(tree, group.pid)
  }
  return group
}

export const base64 = str =>
  typeof str === 'string'
    ? Buffer.from(str).toString('base64')
    : Buffer.from(JSON.stringify(str)).toString('base64')

export default {
  root,
  loadYaml,
  getCache,
  getManifest,
  getLocaleManifest,
  getServerConfig,
  isValidReferer,
  isAppsRoute,
  decryptPassword,
  safeParseJSON,
  firstUpperCase,
  generateId,
  getAllPids,
  getAllChildIds,
  base64,
  getRootGroup,
}
