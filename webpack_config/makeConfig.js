'use strict';
const path = require('path');
const webpack = require('webpack');
const threadLoader = require('thread-loader');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
// const AutoDllPlugin = require('autodll-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const SriPlugin = require('webpack-subresource-integrity');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const ClearDistPlugin = require('./plugins/clearDist');

const config = require('./config');

const DEFAULT_OPTIONS = {
  isProduction: false,
  isElectronBuild: false,
  isHTMLBuild: false,
  outputDir: ''
};

module.exports = function(opts = {}) {
  const options = Object.assign({}, DEFAULT_OPTIONS, opts);
  const isDownloadable = options.isHTMLBuild || options.isElectronBuild;
  const commitHash = process.env.npm_package_gitHead;

  // ====================
  // ====== Entry =======
  // ====================
  const entry = {
    client: './common/index.tsx'
  };

  if (options.isProduction) {
    entry.vendor = config.vendorModules;
  }

  // ====================
  // ====== Rules =======
  // ====================
  const rules = [];

  // Typescript
  if (options.isProduction || !process.env.SLOW_BUILD_SPEED) {
    rules.push(config.typescriptRule);
  } else {
    threadLoader.warmup(config.typescriptRule.use[0].options, [
      config.typescriptRule.use[0].loader
    ]);
    rules.push({
      ...config.typescriptRule,
      use: [
        {
          loader: 'thread-loader',
          options: {
            workers: 4
          }
        },
        ...config.typescriptRule.use
      ]
    });
  }

  // Styles (CSS, SCSS)
  const sassLoader = {
    loader: 'sass-loader',
    options: {
      data: `$is-electron: ${options.isElectronBuild};`
    }
  };

  if (options.isProduction) {
    rules.push(
      {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          sassLoader
        ]
      }
    );
  } else {
    rules.push(
      {
        test: /\.css$/,
        include: path.resolve(config.path.src, 'vendor'),
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        include: ['components', 'containers', 'sass']
          .map(dir => path.resolve(config.path.src, dir))
          .concat([config.path.modules]),

        use: ['style-loader', 'css-loader', sassLoader]
      }
    );
  }

  // Web workers
  rules.push({
    test: /\.worker\.js$/,
    loader: 'worker-loader'
  });

  // Images
  rules.push({
    include: [path.resolve(config.path.assets), path.resolve(config.path.modules)],
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          hash: 'sha512',
          digest: 'hex',
          name: '[path][name].[ext]?[hash:6]'
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
            interlaced: false
          },
          mozjpeg: {
            quality: 80
          },
          svgo: {
            plugins: [{ removeViewBox: true }, { removeEmptyAttrs: false }, { sortAttrs: true }]
          }
        }
      }
    ]
  });

  // Fonts
  rules.push({
    include: [path.resolve(config.path.assets), path.resolve(config.path.modules)],
    test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
    loader: 'file-loader'
  });

  // ====================
  // ====== Plugins =====
  // ====================
  const plugins = [
    new HtmlWebpackPlugin({
      title: config.title,
      template: path.resolve(config.path.src, 'index.html'),
      inject: true
    }),

    new CopyWebpackPlugin([
      {
        from: config.path.static,
        // to the root of dist path
        to: './'
      }
    ]),

    new webpack.LoaderOptionsPlugin({
      minimize: options.isProduction,
      debug: !options.isProduction,
      options: {
        // css-loader relies on context
        context: process.cwd()
      }
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(options.isProduction ? 'production' : 'development'),
      'process.env.BUILD_DOWNLOADABLE': JSON.stringify(isDownloadable),
      'process.env.BUILD_HTML': JSON.stringify(options.isHTMLBuild),
      'process.env.BUILD_ELECTRON': JSON.stringify(options.isElectronBuild)
    })
  ];

  if (options.isProduction) {
    plugins.push(
      new MiniCSSExtractPlugin({
        filename: `[name].[contenthash:8].css`
      }),
      new WebappWebpackPlugin({
        logo: path.resolve(config.path.assets, 'images/favicon.png'),
        cacheDirectory: false, // Cache makes builds nondeterministic
        inject: true,
        prefix: 'common/assets/meta-[hash]',
        favicons: {
          appDescription: 'Ethereum web interface',
          display: 'standalone',
          theme_color: '#007896'
        }
      }),
      new SriPlugin({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: true
      }),
      new ProgressPlugin(),
      new ClearDistPlugin()
    );
  } else {
    plugins.push(
      // new AutoDllPlugin({
      //   inject: true, // will inject the DLL bundles to index.html
      //   filename: '[name]_[hash].js',
      //   debug: true,
      //   context: path.join(config.path.root),
      //   entry: {
      //     vendor: [...config.vendorModules, 'babel-polyfill', 'bootstrap-sass', 'font-awesome']
      //   }
      // }),
      new HardSourceWebpackPlugin({
        environmentHash: {
          root: process.cwd(),
          directories: ['common/webpack_config'],
          files: ['package.json']
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new FriendlyErrorsPlugin()
    );
  }

  if (options.isElectronBuild) {
    // target: 'electron-renderer' kills scrypt, so manually pull in some
    // of its configuration instead
    plugins.push(
      new webpack.ExternalsPlugin('commonjs', [
        'desktop-capturer',
        'electron',
        'ipc',
        'ipc-renderer',
        'remote',
        'web-frame',
        'clipboard',
        'crash-reporter',
        'native-image',
        'screen',
        'shell'
      ])
    );
  }

  // ====================
  // === Optimization ===
  // ====================
  const optimization = {};
  if (options.isProduction) {
    optimization.splitChunks = {
      chunks: 'all'
    };
    optimization.concatenateModules = false;
  }

  // ====================
  // ====== DevTool =====
  // ====================
  let devtool = false;
  if (!options.isProduction) {
    if (process.env.VSCODE_DEBUG) {
      devtool = 'cheap-module-source-map';
    } else {
      devtool = 'cheap-module-eval-source-map';
    }
  }

  // ====================
  // ====== Output ======
  // ====================
  const output = {
    path: path.resolve(config.path.output, options.outputDir),
    filename: options.isProduction ? `[name].${commitHash}.js` : '[name].js',
    publicPath: isDownloadable && options.isProduction ? './' : '/',
    crossOriginLoading: 'anonymous',
    // Fix workers & HMR https://github.com/webpack/webpack/issues/6642
    globalObject: options.isProduction ? undefined : 'self'
  };

  // The final bundle
  return {
    devtool,
    entry,
    output,
    module: { rules },
    plugins,
    target: 'web',
    resolve: config.resolve,
    performance: {
      hints: options.isProduction ? 'warning' : false
    },
    optimization,
    mode: options.isProduction ? 'production' : 'development',
    stats: {
      // Reduce build output
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false
    }
  };
};
