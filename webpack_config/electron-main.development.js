const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');

module.exports = {
  target: 'electron-main',
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: {
    main: path.join(config.path.electron, 'main/index.ts'),
  },

  output: {
    filename: '[name].js',
    path: path.join(config.path.output, 'electron-main')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [
      config.path.src,
      config.path.modules,
      config.path.root
    ]
  },

  module: {
    rules: [
      /**
       * TypeScript files
       */
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            }
          }
        ],
        include: [
          config.path.src,
          config.path.shared,
          config.path.electron
        ],
        exclude: /node_modules/,
      },

      /**
       * Images
       */
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'common/assets/[name].[contenthash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {
                optimizationLevel: 4
              },
              gifsicle: {
                interlaced: true
              },
              mozjpeg: {
                quality: 80
              },
              svgo: {
                plugins: [
                  {
                    removeViewBox: true
                  },
                  {
                    removeEmptyAttrs: false
                  },
                  {
                    sortAttrs: true
                  }
                ]
              }
            }
          }
        ],
        include: [
          config.path.assets,
          config.path.modules
        ]
      },

      /**
       * HTML files
       */
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),

    new webpack.EnvironmentPlugin({
      'NODE_ENV': 'development'
    }),

    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(config.path.root, 'tsconfig.json'),
      tslint: path.join(config.path.root, 'tslint.json'),
      reportFiles: [
        '**/*.{ts,tsx}',
        '!node_modules/**/*'
      ]
    })
  ],

  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb'
  },

  node: {
    __dirname: false,
    __filename: false
  }
};
