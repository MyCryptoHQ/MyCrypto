module.exports = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ],
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        // Enable lodash tree shaking
        // https://www.azavea.com/blog/2019/03/07/lessons-on-tree-shaking-lodash/
        modules: false,
        targets: { node: 12 },
        // babel defaults to core-js@2.
        // https://github.com/babel/babel/issues/9713#issuecomment-474828830
        useBuiltIns: 'usage',
        corejs: 3,
        loose: true
      }
    ]
  ],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-syntax-dynamic-import',
    // Fix warnings with TS "export '...' was not found in '...' "
    // https: //github.com/webpack-contrib/imports-loader/issues/68#issuecomment-528788909
    '@babel/plugin-transform-modules-commonjs',
    process.env.NODE_ENV === 'development' && 'react-refresh/babel'
  ].filter(Boolean)
};
