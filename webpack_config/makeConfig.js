'use strict';
const path = require('path');
const webpack = require('webpack');
const threadLoader = require('thread-loader');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const ClearDistPlugin = require('./plugins/clearDist');
const SortCachePlugin = require('./plugins/sortCache');

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
  }
  else {
    threadLoader.warmup(
      config.typescriptRule.use[0].options,
      [config.typescriptRule.use[0].loader]
    );
    rules.push({
      ...config.typescriptRule,
      use: [{
        loader: 'thread-loader',
        options: {
          workers: 4
        }
      }, ...config.typescriptRule.use],
    });
  }

  // Styles (CSS, SCSS, LESS)
  if (options.isProduction) {
    rules.push({
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'less-loader']
      })
    });
  } else {
    rules.push({
      test: /\.css$/,
      include: path.resolve(config.path.src, 'vendor'),
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.scss$/,
      include: ['components', 'containers', 'sass']
        .map(dir => path.resolve(config.path.src, dir))
        .concat([config.path.modules]),

      exclude: /node_modules(?!\/font-awesome)/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.less$/,
      include: path.resolve(config.path.assets, 'styles'),
      use: ['style-loader', 'css-loader', 'less-loader']
    });
  }

  // Web workers
  rules.push({
    test: /\.worker\.js$/,
    loader: 'worker-loader'
  });

  // Images
  rules.push({
    include: [
      path.resolve(config.path.assets),
      path.resolve(config.path.modules)
    ],
    exclude: /node_modules(?!\/font-awesome)/,
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
    include: [
      path.resolve(config.path.assets),
      path.resolve(config.path.modules)
    ],
    exclude: /node_modules(?!\/font-awesome)/,
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
    }),
  ];

  if (options.isProduction) {
    plugins.push(
      new BabelMinifyPlugin({
        // Mangle seems to be reusing variable identifiers, causing errors
        mangle: false,
        // These two on top of a lodash file are causing illegal characters for
        // safari and ios browsers
        evaluate: false,
        propertyLiterals: false,
      }, {
        comments: false
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.[chunkhash:8].js'
      }),
      new ExtractTextPlugin('[name].[chunkhash:8].css'),
      new FaviconsWebpackPlugin({
        logo: path.resolve(config.path.static, 'favicon/android-chrome-384x384.png'),
        background: '#163151',
        inject: true
      }),
      new SriPlugin({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: true
      }),
      new ProgressPlugin(),
      new ClearDistPlugin(),
      new SortCachePlugin()
    )
  }
  else {
    plugins.push(
      new AutoDllPlugin({
        inject: true, // will inject the DLL bundles to index.html
        filename: '[name]_[hash].js',
        debug: true,
        context: path.join(config.path.root),
        entry: {
          vendor: [
            ...config.vendorModules,
            'babel-polyfill',
            'bootstrap-sass',
            'font-awesome'
          ]
        }
      }),
      new HardSourceWebpackPlugin({
        environmentHash: {
          root: process.cwd(),
          directories: ['webpack_config'],
          files: ['package.json']
        }
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new FriendlyErrorsPlugin()
    );
  }

  if (options.isElectronBuild) {
    // target: 'electron-renderer' kills scrypt, so manually pull in some
    // of its configuration instead
    plugins.push(new webpack.ExternalsPlugin("commonjs", [
			"desktop-capturer",
			"electron",
			"ipc",
			"ipc-renderer",
			"remote",
			"web-frame",
			"clipboard",
			"crash-reporter",
			"native-image",
			"screen",
			"shell"
		]));
  }

  // ====================
  // ====== DevTool =====
  // ====================
  let devtool = false;
  if (!options.isProduction) {
    if (process.env.SLOW_BUILD_SPEED) {
      devtool = 'source-map';
    }
    else {
      devtool = 'cheap-module-eval-source-map';
    }
  }

  // ====================
  // ====== Output ======
  // ====================
  const output = {
    path: path.resolve(config.path.output, options.outputDir),
    filename: options.isProduction ? '[name].[chunkhash:8].js' : '[name].js',
    publicPath: isDownloadable && options.isProduction ? './' : '/',
    crossOriginLoading: 'anonymous'
  }


  // The final bundle
  return {
    entry,
    output,
    module: { rules },
    plugins,
    target: 'web',
    resolve: config.resolve,
    performance: {
      hints: options.isProduction ? 'warning' : false
    },
    stats: {
      // Reduce build output
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false
    }
  };
}
