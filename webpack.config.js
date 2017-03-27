var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './scripts.js',
  output: {
    path: __dirname + '',
    filename: 'scripts.min.js'
  },

  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  plugins: []

};

if(process.env.NODE_ENV === 'production') {

  module.exports.plugings.push(

      new webpack.optimize.UglifyJsPlugin()

    );
}
