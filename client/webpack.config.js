// this webpack config file compiles our js and jsx down to js, also launches our dev server

// configuration object
module.exports = {
  devtool: 'source-map',
  entry: './main.js',
  output: {
    path: './', // output to root path
    filename: 'index.js' // bundled file
  },
  devServer: {
    inline: true, // reload on the fly
    port: 3333
  },
  module: {
    loaders: [
      {
        test: /\.js$/, // look for .js at end of file
        exclude: /node_modules/, // so we don't process all of those
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'] // preloaders
        }
      },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      {test: /\.(png|jpg|jpeg|otf)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  stylus: {
    use: [require('nib')()],
    import: ['~nib/lib/nib/index.styl']
  }
}