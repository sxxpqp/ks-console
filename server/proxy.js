const http = require('http')

const { getServerConfig } = require('./libs/utils')

const { server: serverConfig } = getServerConfig()

const NEED_OMIT_HEADERS = ['cookie', 'referer']

const k8sResourceProxy = {
  target: serverConfig.apiServer.url,
  changeOrigin: true,
  events: {
    proxyReq(proxyReq, req) {
      // Set authorization
      if (req.token) {
        proxyReq.setHeader('Authorization', `Bearer ${req.token}`)
      }

      NEED_OMIT_HEADERS.forEach(key => proxyReq.removeHeader(key))
    },
  },
}

const devopsWebhookProxy = {
  target: `${serverConfig.apiServer.url}/kapis/devops.kubesphere.io/v1alpha2`,
  changeOrigin: true,
  ignorePath: true,
  optionsHandle(options, req) {
    options.target += `/${req.url.slice(8)}`
  },
}

const b2iFileProxy = {
  target: serverConfig.apiServer.url,
  changeOrigin: true,
  ignorePath: true,
  selfHandleResponse: true,
  optionsHandle(options, req) {
    options.target += `/${req.url.slice(14)}`
  },
  events: {
    proxyReq(proxyReq, req) {
      proxyReq.setHeader('Authorization', `Bearer ${req.token}`)

      NEED_OMIT_HEADERS.forEach(key => proxyReq.removeHeader(key))
    },
    proxyRes(proxyRes, req, client_res) {
      let body = []
      proxyRes.on('data', chunk => {
        body.push(chunk)
      })
      proxyRes.on('end', () => {
        const redirectUrl = proxyRes.headers.location
        if (!redirectUrl) {
          body = Buffer.concat(body).toString()
          client_res.writeHead(500, proxyRes.headers)
          client_res.end(body)
          console.error(`get b2i file failed, message: ${body}`)
        }
        const proxy = http.get(proxyRes.headers.location, res => {
          client_res.writeHead(res.statusCode, res.headers)
          res.pipe(client_res, { end: true })
        })
        client_res.pipe(proxy, { end: true })
      })
    },
  },
}

module.exports = {
  k8sResourceProxy,
  devopsWebhookProxy,
  b2iFileProxy,
}
