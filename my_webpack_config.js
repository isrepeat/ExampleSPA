
module.exports = {
  entry:  {
    './resources/scripts/bundle.js':  __dirname + "/source/index.js", // [name] станет => ['./resources/scripts/bundle.js']
  },
  mode: "development",
  output: {
    path: __dirname,
    filename: '[name]', //если указывать путь в filename то на webpack-dev-server тоже будет такой путь (иначе в корневой)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
    ]
  },
  devServer: {
    contentBase: __dirname, // директория где будут располагатся файлы сервера (index, resources ...) ==> React_N
    port: 80,
    //watchContentBase: true,
    //open: true,
    historyApiFallback: true,
  },
};
