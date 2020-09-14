const generateChunkName = (module) => {
  // get the name. E.g. node_modules/packageName/not/this/part.js
  // or node_modules/packageName
  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

  // npm package names are URL-safe, but some servers don't like @ symbols
  return `npm.${packageName.replace('@', '')}`;
};

module.exports = {
  generateChunkName
};
