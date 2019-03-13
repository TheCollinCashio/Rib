const path = require('path')

module.exports = {
  mode: 'none',
  entry: ['@babel/polyfill', './client/src/App.jsx'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
          test:/\.css$/,
          use:['style-loader','css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: path.resolve(`${__dirname}/client/`, 'build'),
    filename: 'bundle.js'
  },
}