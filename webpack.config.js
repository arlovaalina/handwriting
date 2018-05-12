const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },

  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=images/[hash].[ext]',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx?|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: [
      "node_modules",
      path.resolve(__dirname, "./src")
    ],
  }
};

module.exports = config;
