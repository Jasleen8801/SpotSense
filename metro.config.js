const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
};

module.exports = config;
