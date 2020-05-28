const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const config = require('./config');
const { generateChunkName } = require('./utils');

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'web',

  entry: {
    badBrowserCheck: path.join(config.path.src, 'badBrowserCheck.ts'),
    main: path.join(config.path.src, 'index.tsx')
  },

  output: {
    path: config.path.output,
    publicPath: '/',
    crossOriginLoading: 'anonymous',
    globalObject: 'self'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.json', '.scss'],
    modules: [config.path.src, config.path.modules, config.path.root],
    alias: {
      modernizr$: path.resolve(__dirname, '../.modernizrrc.js'),
      '@fixtures': `${config.path.root}/jest_config/__fixtures__`
    },
    plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, '../tsconfig.json') })]

  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          enforce: true,
          name: 'vendor.bundle',
          chunks: 'all',
          test(mod) {
            const excluded = `${config.chunks.individual.join('|')}|${config.chunks.electronOnly.join('|')}|${config.chunks.devOnly.join('|').replace(/\//, '[\\\\/]')}`;
            const excludeNodeModules = new RegExp(`[\\\\/]node_modules[\\\\/]((${excluded})\.*)`);
            const includeCommon = new RegExp(/[\\/]common[\\/]/);
            const includeNodeModules = new RegExp(/node_modules/);
            return mod.context
              && includeNodeModules.test(mod.context) && !excludeNodeModules.test(mod.context) && !includeCommon.test(mod.context);
          },
          priority: 20
        },
        common: {
          name: 'common.bundle',
          test: /[\\/]common[\\/]/,
          minChunks: 2,
          chunks: 'all',
          reuseExistingChunk: true,
          enforce: true,
          priority: 10
        },
        vendorIndividual: {
          name: generateChunkName,
          enforce: true,
          chunks: 'all',
          test: new RegExp(`[\\\\/]node_modules[\\\\/](${config.chunks.individual.join('|')})[\\\\/]`),
          priority: 50
        },
        vendorDev: {
          name: 'vendor-dev',
          enforce: true,
          chunks: 'all',
          test: new RegExp(`[\\\\/]node_modules[\\\\/](${config.chunks.devOnly.join('|').replace(/\//, '[\\\\/]')})[\\\\/]`),
          priority: 40
        },
        vendorElectron: {
          name: 'vendor-electron',
          enforce: true,
          chunks: 'all',
          test: new RegExp(`[\\\\/]node_modules[\\\\/](${config.chunks.electronOnly.join('|')})[\\\\/]`),
          priority: 30
        }
      }
    }
  },

  module: {
    rules: [
      /**
       * TypeScript files without stories
       */
      {
        test: /(?!.*\.stories\.tsx?$).*\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              // allow lodash-webpack-plugin to reduce lodash size.
              // allow babel-plugin-recharts to reduce recharts size.
              plugins: [
                'lodash',
                'recharts'
              ]
            }
          }
        ],
        include: [
          config.path.src,
          config.path.shared,
          config.path.electron,
          config.path.testConfig
        ],
        exclude: [/node_modules/]
      },

      /*
       * Ignore stories files
       */
      { test: /\.stories\.tsx?$/, loader: 'ignore-loader' },

      /**
       * Workers
       */
      {
        test: /\.worker\.js$/,
        use: ['worker-loader']
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
              name: 'src/assets/[name].[contenthash].[ext]'
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
        include: [config.path.assets, config.path.modules]
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
              name: 'src/assets/[name].[contenthash].[ext]'
            }
          }
        ],
        include: [config.path.assets, config.path.modules]
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

    new StyleLintPlugin({
      files: '**/*.tsx',
      lintDirtyModulesOnly: true,
      quiet: true
    }),

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
        : "default-src 'none'; script-src 'self' https://mycryptobuilds.com https://beta.mycrypto.com; worker-src 'self' blob:; child-src 'self'; style-src 'self' 'unsafe-inline'; manifest-src 'self'; font-src 'self'; img-src 'self' data: https://mycryptoapi.com/api/v1/images/; connect-src *; frame-src 'self' https://connect.trezor.io;"
    }),

    new CopyWebpackPlugin([
      config.path.static,
      path.join(config.path.assets, 'images/link-preview.png')
    ]),

    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(config.path.root, 'tsconfig.json'),
      tslint: path.join(config.path.root, 'tslint.json'),
      reportFiles: ['**/*.{ts,tsx}', '!node_modules/**/*']
    }),

    // Allow tree shaking for lodash
    new LodashModuleReplacementPlugin(),

    // Ignore all locale files of moment.js
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],

  stats: {
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false
  },

  performance: {
    hints: 'warning'
  },

  externals: [
    // This was added because there were build issues with ethers.js
    // as we included some of the built-in BigNumber and Hex processing functions it provided.
    {
      xmlhttprequest: 'XMLHttpRequest'
    }
  ]
};
