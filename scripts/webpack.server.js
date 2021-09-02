// const { resolve } = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.server.base')

// const root = path => resolve(__dirname, `../${path}`)

const config = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})

module.exports = config
