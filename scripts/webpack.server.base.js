const { resolve } = require('path')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const HappyPack = require('happypack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const root = path => resolve(__dirname, `../${path}`)

const config = {
  entry: {
    server: './server/server.js',
  },
  output: {
    path: root('dist/'),
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  optimization: {
    minimize: false,
  },
  externals: [
    {
      hiredis: 'hiredis',
      webpack: 'webpack',
      'koa-webpack-middleware': 'koa-webpack-middleware',
    },
    // {
    //   formidable: 'commonjs formidable',
    // },
  ], // in order to ignore all modules in node_modules folder
  resolve: {
    // 添加server的alias配置
    alias: {
      '@': root('server'),
    },
  },
  // externals: {
  //   hiredis: 'hiredis',
  //   webpack: 'webpack',
  //   'koa-webpack-middleware': 'koa-webpack-middleware',
  // }, // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        test: /\.(yml|html|css|svg|properties|ttf|otf|eot|woff2?)(\?.+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
      {
        test: /\.jsx?$/,
        use: 'happypack/loader?id=jsx',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new HappyPack({
      id: 'jsx',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      ],
      threads: 5,
    }),
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new WebpackBar(),
    new FriendlyErrorsWebpackPlugin(),
  ],
  stats: 'errors-only',
}

module.exports = config
