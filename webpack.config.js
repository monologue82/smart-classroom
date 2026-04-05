const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    // 为登录页面创建一个入口点
    login: './login.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 删除console语句
            drop_debugger: true, // 删除debugger语句
            pure_funcs: ['console.log'] // 删除特定的函数调用
          },
          mangle: {
            reserved: ['authManager', 'protectPage'] // 保留特定的变量名
          },
          format: {
            comments: false // 删除注释
          }
        },
        extractComments: false, // 不提取注释到单独的文件
      }),
    ],
  },
  plugins: [
    // 可以添加其他插件
  ],
  devtool: false, // 禁用source map以增加反向工程难度
};