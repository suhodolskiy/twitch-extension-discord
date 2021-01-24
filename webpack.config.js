const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  const distPath = path.join(__dirname, 'dist')

  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].style.css',
    }),
  ]

  const entries = {}

  for (const entry of ['panel', 'config']) {
    entries[entry] = `./src/components/${entry}/index.ts`

    plugins.push(
      new HtmlWebpackPlugin({
        filename: `${entry}.html`,
        template: `./src/components/${entry}/index.html`,
        chunks: [entry],
      })
    )
  }

  let devServer

  if (isDev) {
    devServer = {
      contentBase: path.join(__dirname, 'public'),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: 8080,
    }

    if (fs.existsSync(path.resolve(__dirname, 'conf/server.key'))) {
      devServer.https = {
        key: fs.readFileSync(path.resolve(__dirname, 'conf/server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'conf/server.crt')),
      }
    }

    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  return {
    plugins,
    devServer,
    entry: entries,
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    output: {
      filename: '[name].bundle.js',
      path: distPath,
    },
  }
}
