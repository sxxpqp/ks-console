/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

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
