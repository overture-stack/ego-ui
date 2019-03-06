const path = require('path');
const { EnvironmentPlugin } = require('webpack');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');

  // Add the EnvironmentPlugin
  config.plugins.push(
    new EnvironmentPlugin(Object.assign({}, require('dotenv').config(), process.env)),
  );

  config.resolve.modules = [
    path.resolve(__dirname, '..', process.env.NODE_PATH || 'src'),
    'node_modules',
  ];
  return config;
};
