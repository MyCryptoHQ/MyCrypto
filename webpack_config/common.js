const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { IS_DEV } = require('../environment');
const config = require('./config');

module.exports = {
  target: 'web',

  entry: {
    badBrowserCheck: path.join(config.path.src, 'badBrowserCheck.ts'),
    metaMaskFirefox: path.join(config.path.vendor, 'inpage-metamask.js'),
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
    modules: [config.path.src, 'node_modules'],
    alias: {
      modernizr$: path.resolve(__dirname, '../.modernizrrc.js'),
      '@fixtures': `${config.path.root}/jest_config/__fixtures__`,
      // recharts 1.8.5 relies on core-js@2. Allow it to resolve to core-js@3
      // https://github.com/recharts/recharts/issues/1673#issuecomment-499680671
      'core-js/es6': 'core-js/es'
    },
    plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, '../tsconfig.json') })]
  },

  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: 'all',
          name: 'vendor.bundle',
          test(mod) {
            const excluded = `${config.chunks.individual.join('|')}|${config.chunks.devOnly
              .join('|')
              .replace(/\//, '[\\\\/]')}`;
            const excludeNodeModules = new RegExp(`[\\\\/]node_modules[\\\\/]((${excluded}).*)`);
            const includeSrc = new RegExp(/[\\/]src[\\/]/);
            const includeNodeModules = new RegExp(/node_modules/);
            return (
              mod.context &&
              includeNodeModules.test(mod.context) &&
              !excludeNodeModules.test(mod.context) &&
              !includeSrc.test(mod.context)
            );
          },
          reuseExistingChunk: true,
          priority: 20
        },
        common: {
          enforce: true,
          chunks: 'all',
          name: 'src.bundle',
          minChunks: 2,
          reuseExistingChunk: true,
          priority: 10
        },
        vendorDev: {
          enforce: true,
          chunks: 'all',
          name: 'vendor-dev',
          test: new RegExp(
            `[\\\\/]node_modules[\\\\/](${config.chunks.devOnly
              .join('|')
              .replace(/\//, '[\\\\/]')})[\\\\/]`
          ),
          priority: 40
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
                'recharts',
                IS_DEV && require.resolve('react-refresh/babel')
              ].filter(Boolean)
            }
          }
        ],
        include: [config.path.src, config.path.shared, config.path.testConfig],
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

    new FaviconsWebpackPlugin({
      logo: path.resolve(config.path.assets, 'images/favicon.png'),
      cacheDirectory: false, // Cache makes builds nondeterministic
      inject: true,
      prefix: 'src/assets/meta-[hash]',
      favicons: {
        appDescription: 'Ethereum Wallet Manager',
        display: 'standalone',
        theme_color: '#007896'
      }
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
      metaCsp: IS_DEV
        ? ''
        : `default-src 'none'; script-src 'self'; worker-src 'self' blob:; child-src 'self'; style-src 'self' 'unsafe-inline'; manifest-src 'self'; font-src 'self'; img-src 'self' data: https://mycryptoapi.com/api/v1/images/; connect-src *; frame-src 'self' https://connect.trezor.io https://landing.mycryptobuilds.com https://app.mycrypto.com;`
    }),

    new CopyWebpackPlugin([
      config.path.static,
      path.join(config.path.assets, 'images/link-preview.png')
    ]),

    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.join(config.path.root, 'tsconfig.json'),
      reportFiles: ['**/*.{ts,tsx}', '!node_modules/**/*']
    }),

    // Allow tree shaking for lodash
    new LodashModuleReplacementPlugin({ flattening: true })
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
