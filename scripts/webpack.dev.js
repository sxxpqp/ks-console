const { resolve } = require('path')
const webpack = require('webpack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const baseConfig = require('./webpack.base')
const localeConfig = require('./webpack.locale')

const root = path => resolve(__dirname, `../${path}`)

const config = {
  mode: 'development',
  entry: baseConfig.entry,
  output: {
    filename: '[name].js',
    path: root('dist/'),
    publicPath: '/',
    pathinfo: false,
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      ...baseConfig.moduleRules,
      {
        test: /\.s[ac]ss$/i,
        include: root('src'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              importLoaders: 1,
              localIdentName: '[path][name]__[local]',
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        include: root('node_modules'),
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              importLoaders: 2,
            },
          },
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
        include: root('src/assets'),
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'async',
      minChunks: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?!(ace-builds|react-ace|xterm)).*.jsx?$/,
          name: 'vendor',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          minSize: 30000,
        },
      },
    },
  },
  resolve: baseConfig.resolve,
  plugins: [
    ...baseConfig.plugins,
    new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({ overlay: false }),
    new webpack.WatchIgnorePlugin([
      root('node_modules'),
      root('server'),
      root('build'),
      root('dist'),
    ]),
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devServer: {
    publicPath: '/',
    compress: true,
    noInfo: false,
    quiet: false,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8001,
  },
  // 关闭console提示
  stats: 'errors-only',
}

module.exports = [config, localeConfig]
