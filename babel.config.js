module.exports = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      // Enable lodash tree shaking
      // https://www.azavea.com/blog/2019/03/07/lessons-on-tree-shaking-lodash/
      { modules: false, targets: { node: 4 } }
    ]
  ],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    // Fix warnings with TS "export '...' was not found in '...' "
    // https: //github.com/webpack-contrib/imports-loader/issues/68#issuecomment-528788909
    '@babel/plugin-transform-modules-commonjs',
    'react-hot-loader/babel'
  ]
};
