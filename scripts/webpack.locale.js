const fs = require('fs')
const { resolve } = require('path')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const LocalePlugin = require('./locale-plugin')

const root = path => resolve(__dirname, `../${path}`)

const isDev = process.env.NODE_ENV === 'development'

const langs = fs.readdirSync(root('locales'))
const entries = langs.reduce(
  (prev, cur) => ({
    ...prev,
    [`locale-${cur}`]: `./locales/${cur}/index.js`,
  }),
  {}
)

const filename = isDev ? '[name].json' : '[name].[chunkhash].json'

module.exports = {
  mode: isDev ? 'development' : 'production',
  target: 'node',
  entry: entries,
  output: {
    filename,
    path: root('dist/'),
    publicPath: '/dist/',
  },
  plugins: [
    new LocalePlugin({ output: '../dist' }),
    new WebpackAssetsManifest({
      entrypoints: true,
      writeToDisk: true,
      output: '../dist/manifest.locale.json',
    }),
  ],
}
