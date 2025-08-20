module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@assets": "./src/assets",
            "@utils": "./src/utils"
          }
        }
      ]
    ]
  };
};
