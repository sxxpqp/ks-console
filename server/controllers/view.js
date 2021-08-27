const {
  getCurrentUser,
  getKSConfig,
  getOAuthInfo,
} = require('../services/session')

const {
  getServerConfig,
  getManifest,
  getLocaleManifest,
  isValidReferer,
} = require('../libs/utils')

const { client: clientConfig } = getServerConfig()

const renderView = async ctx => {
  try {
    const [user, ksConfig] = await Promise.all([
      getCurrentUser(ctx),
      getKSConfig(),
    ])

    await renderIndex(ctx, { ksConfig, user })
  } catch (err) {
    renderViewErr(ctx, err)
  }
}

const renderLogin = async ctx => {
  ctx.cookies.set('referer', ctx.query.referer)

  const oauthServers = await getOAuthInfo(ctx)

  await renderIndex(ctx, {
    oauthServers: oauthServers || [],
  })
}

const renderLoginConfirm = async ctx => {
  await renderIndex(ctx, {
    user: {
      username: ctx.cookies.get('defaultUser'),
      email: ctx.cookies.get('defaultEmail'),
    },
  })
}

const renderIndex = async (ctx, params) => {
  const manifest = getManifest('main')
  const localeManifest = getLocaleManifest()

  await ctx.render('index', {
    manifest,
    isDev: global.MODE_DEV,
    title: clientConfig.title,
    hostname: ctx.hostname,
    globals: JSON.stringify({
      config: clientConfig,
      localeManifest,
      ...params,
    }),
  })
}

const renderTerminal = async ctx => {
  try {
    const manifest = getManifest('terminalEntry')
    const [user, ksConfig] = await Promise.all([
      getCurrentUser(ctx),
      getKSConfig(),
    ])
    const localeManifest = getLocaleManifest()

    await ctx.render('terminal', {
      manifest,
      isDev: global.MODE_DEV,
      title: clientConfig.title,
      hostname: ctx.hostname,
      globals: JSON.stringify({
        localeManifest,
        user,
        ksConfig,
      }),
    })
  } catch (err) {
    renderViewErr(ctx, err)
  }
}

const renderMarkdown = async ctx => {
  await ctx.render('blank_markdown')
}

const renderViewErr = async (ctx, err) => {
  ctx.app.emit('error', err)
  if (err) {
    if (err.code === 401 || err.code === 403 || err.status === 401) {
      if (isValidReferer(ctx.path)) {
        ctx.redirect(`/login?referer=${ctx.path}`)
      } else {
        ctx.redirect('/login')
      }
    } else if (err.code === 502) {
      await ctx.render('error', {
        title: clientConfig.title,
        t: ctx.t.bind(ctx),
        message: 'Unable to access the backend services',
      })
    } else if (err.code === 'ETIMEDOUT') {
      await ctx.render('error', {
        title: clientConfig.title,
        t: ctx.t.bind(ctx),
        message: 'Unable to access the api server',
      })
    } else {
      ctx.app.emit('error', err)
    }
  } else {
    await ctx.render('error', {
      title: clientConfig.title,
      t: ctx.t.bind(ctx),
    })
  }
}

module.exports = {
  renderView,
  renderTerminal,
  renderLogin,
  renderMarkdown,
  renderLoginConfirm,
}
