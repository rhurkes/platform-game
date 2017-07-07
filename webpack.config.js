const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require("webpack");

const tsLoaderOptions = process.env.NODE_ENV === 'production'
  ? { compilerOptions: { sourceMap: false } }
  : {};

const config = {
  entry: './src/main.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'sware',
      template: 'src/main.ejs'
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
  ],
  module: {
    rules: [{
        test: /\.(tsx|ts)$/,
        loader: 'awesome-typescript-loader',
        options: tsLoaderOptions,
      }
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
  },
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
} else {
  config.devtool = 'inline-source-map';
  config.module.rules.push({
    test: /\.(tsx|ts)$/,
    loader: 'source-map-loader',
    enforce: 'pre'
  });
}

module.exports = config;
