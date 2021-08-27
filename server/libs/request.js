const { resolve4 } = require('dns')
const https = require('https')
const isArray = require('lodash/isArray')

const request = require('./request.base')
const { getServerConfig } = require('./utils')

const { server: serverConfig } = getServerConfig()

/**
 *  gateway api request, if get logined resource, token must exists,
 * @param {options} options: { token, method, url, params }
 */
const send_gateway_request = ({
  method,
  url,
  params,
  token,
  headers = {},
  ...rest
}) => {
  const options = { headers, ...rest }

  if (token) {
    options.headers = {
      Authorization: `Bearer ${token}`,
      'content-type': headers['content-type'] || 'application/json',
      'x-client-ip': headers['x-client-ip'],
    }
  }

  return request[method.toLowerCase()](
    `${serverConfig.apiServer.url}${url}`,
    params,
    options
  )
}

const send_dockerhub_request = ({ params, path, headers }) => {
  const httpsAgent = new https.Agent({
    lookup: (host, options, cb) => {
      resolve4(host, options, (err, addresses) => {
        if (isArray(addresses)) {
          cb(err, addresses[0], 4)
        }
      })
    },
  })

  const options = {
    headers,
    agent: httpsAgent,
  }

  return request['get'](`${serverConfig.dockerHubUrl}${path}`, params, options)
}

module.exports = {
  send_gateway_request,
  send_dockerhub_request,
}
