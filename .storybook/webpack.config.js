// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
const { EnvironmentPlugin } = require('webpack');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);
  // Extend it as you need.
  // For example, add typescript loader:
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
  });

  // Add the EnvironmentPlugin
  config.plugins.push(
    new EnvironmentPlugin(
      Object.assign({}, require('dotenv').config(), process.env),
    ),
  );

  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
