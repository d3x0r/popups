
// with options
module.exports =function(api) {
  if (api) {
    api.cache(true);
    api.debug = process.env.NODE_ENV === 'development' || false;
  }

  const presets = [ ['@babel/preset-env', { "modules": false }]];
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-classes',
  ];

  return {
    presets,
    plugins,
  };
};


