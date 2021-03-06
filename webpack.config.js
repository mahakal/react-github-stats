const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {test: /\.html$/, use: 'html-loader' },
      {test: /\.js$/, use: 'babel-loader' },
      {test: /\.css$/, use: ['style-loader', 'css-loader' ] }
    ]
  },
  mode: 'development',
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./app/index.html",
    })
  ]
};
