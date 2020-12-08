module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // 配置绝对路径
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@/utils': './src/utils',
          '@/pages': './src/pages',
          '@/navigator': './src/navigator',
          '@/models': './src/models',
          '@/config': './src/config',
          '@/components': './src/components',
          '@/assets': './src/assets',
        }
      }
    ]
  ]
};
