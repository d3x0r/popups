
// with options
module.exports =function(api) {
  if (api) {
    api.cache(true);
    api.debug = process.env.NODE_ENV === 'development' || false;
  }

  const presets = [ '@babel/preset-env'];
  const plugins = [
    '@babel/plugin-proposal-private-property-in-object',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-classes',
  ];
const assumptions = {
    "privateFieldsAsProperties": true,
    "setPublicClassFields": true
  }

  return {
    presets,
    plugins,
	assumptions,
  };
};


