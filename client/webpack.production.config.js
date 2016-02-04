var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',

  entry: './entry.js',

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ],
  
  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      { test: /\.js$/, // look for .js at end of file
        exclude: /node_modules/, // so we don't process all of those
        loader: 'babel',
        query: {presets: ['es2015', 'react', 'stage-0']} },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /\.(png|jpg|jpeg|otf)$/, loader: 'url-loader?limit=8192' },
      { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot$/, loader: "file-loader" },
      { test: /\.svg$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  stylus: {
    use: [require('nib')()],
    import: ['~nib/lib/nib/index.styl']
  }
}
