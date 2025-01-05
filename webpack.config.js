const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

// Common configuration
const commonConfig = {
  entry: './src/orgPrit-root-config.js',
  output: {
    filename: 'orgPrit-root-config.js', // Use contenthash for production
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false, // Minification handled by mode
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: 'src/index.ejs',
      templateParameters: {
        isLocal: process.env.NODE_ENV === 'development',
        orgName: 'orgPrit',
      },
    }),
  ],
};

// Development configuration
const devConfig = {
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'src'),
    port: 9000,
    historyApiFallback: true,
    onBeforeSetupMiddleware: function (devServer) {
      devServer.app.get('/orgPrit-root-config.js', (req, res) => {
        const filePath = path.join(__dirname, 'dist', 'orgPrit-root-config.js');
        res.sendFile(filePath);
      });
    },
    
    hot: true,
    open: true,
  },
  // Source maps for easier debugging
  devtool: 'eval-source-map',
};

// Production configuration
const prodConfig = {
  mode: 'production',
  output: {
    filename: 'orgPrit-root-config.js', // Remove contenthash for predictable filename
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true, // Enable minification for production
            },
          },
        ],
      },
    ],
  },
  // Optimization settings for production
  optimization: {
    minimize: true,
  },
};

module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig);
  }
  return merge(commonConfig, devConfig);
};
