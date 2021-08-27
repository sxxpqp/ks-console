const webpack = require('webpack')
const NodemonPlugin = require('nodemon-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.server.base')

const config = merge(baseConfig, {
  mode: 'development',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  // externals: {
  //   hiredis: 'hiredis',
  //   webpack: 'webpack',
  //   'koa-webpack-middleware': 'koa-webpack-middleware',
  // }, // Need this to avoid error when working with Express
  module: {
    rules: [],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new NodemonPlugin(),
  ],
})

module.exports = config
