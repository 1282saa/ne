module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          allowUndefined: false, // 값 없으면 오류나게 (개발자 실수 빨리 캐치용)
        },
      ],
    ],
  };
};
