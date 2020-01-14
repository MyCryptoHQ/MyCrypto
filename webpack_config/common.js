const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const config = require('./config');

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'web',

  entry: {
    badBrowserCheck: path.join(config.path.src, 'badBrowserCheck.ts'),
    client: path.join(config.path.src, 'index.tsx')
  },

  output: {
    path: config.path.output,
    publicPath: '/',
    crossOriginLoading: 'anonymous',
    globalObject: 'self'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.json', '.scss'],
    modules: [
      config.path.src,
      config.path.modules,
      config.path.root
    ],
    alias: {
      modernizr$: path.resolve(__dirname, '../.modernizrrc.js')
    }
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
       * Workers
       */
      {
        test: /\.worker\.js$/,
        use: [
          'worker-loader'
        ]
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
       * Fonts
       */
      {
        test: /\.(ico|eot|otf|webp|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'common/assets/[name].[contenthash].[ext]'
            }
          }
        ],
        include: [
          config.path.assets,
          config.path.modules
        ]
      },

      /**
       * Bad browser check Modernizr bundle
       */
      {
        test: /\.modernizrrc\.js$/,
        loader: 'webpack-modernizr-loader',
        type: 'javascript/auto'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: path.resolve(config.path.src, 'index.html'),
      inject: true,
      title: config.title,
      appDescription: config.description,
      appUrl: config.url,
      image: config.img,
      type: config.type,
      twitter: {
        site: config.twitter.creator,
        creator: config.twitter.creator
      },
      metaCsp: IS_DEVELOPMENT
        ? ''
        : "default-src 'none'; script-src 'self'; worker-src 'self' blob:; child-src 'self'; style-src 'self' 'unsafe-inline'; manifest-src 'self'; font-src 'self'; img-src 'self' data: https://cdn.mycryptoapi.com/; connect-src *; frame-src 'self' https://connect.trezor.io;"
    }),

    new CopyWebpackPlugin([
      config.path.static,
      path.join(config.path.assets, 'images/link-preview.png')
    ]),

    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(config.path.root, 'tsconfig.json'),
      tslint: path.join(config.path.root, 'tslint.json'),
      reportFiles: [
        '**/*.{ts,tsx}',
        '!node_modules/**/*'
      ]
    })
  ],

  stats: {
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false
  },

  performance: {
    hints: false
  },

  externals: [
    // This was added because there were build issues with ethers.js
    // as we included some of the built-in BigNumber and Hex processing functions it provided.
    {
      xmlhttprequest: 'XMLHttpRequest'
    }
  ]
};
