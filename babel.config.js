module.exports = {
  'presets': [
    '@babel/preset-react',
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        // The following plugin fixes false warnings
        // "export '...' was not found in '...' "
        // https://github.com/webpack-contrib/imports-loader/issues/68
        'modules': ['commonjs'],
      }
    ]
  ],
  'plugins': [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
    'react-hot-loader/babel',
  ]
};
