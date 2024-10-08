module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.js', '.ios.js', '.android.js'],
        alias: {
          // 'src': './src',
          'assets': './src/assets',
          'navigation': './src/navigation',
          'modules': './src/modules',
          'components': './src/components',
          'state': './src/states',
          'services': './src/services',
          'utils': './src/utils',
          'observer': './src/observer',
          'socketIO': './src/socket',
          'hooks': './src/hooks'
        },
      },
    ],
    'react-native-reanimated/plugin'
  ],
};
