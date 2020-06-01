const path = require('path');
const PATHS = {
  currentirectory: __dirname,
  src: path.join(__dirname,'../src'),
  dist: path.join(__dirname,'../dist'),
  assets: 'assets/',
}
var externals = {
  paths: PATHS
};
// Плагины 
const webpack = require('webpack');
// Минификатор JavaScript (Также немного преобразует код)
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// Выделяет CSS код из JS в отдельный файл
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CopyWebpackPlugin = require("copy-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// Подключение плагинов
var plugins = [
  // Автоматически подгружает модули react и react-dom в каждый отдельный файл
  new webpack.ProvidePlugin({
    React: 'react',
    ReactDOM: 'react-dom'
  }),
  // Минификация JavaScript
  new UglifyJsPlugin(),
  // Извлекает CSS код в отдельный файл
  new MiniCssExtractPlugin({
    filename: `${PATHS.assets}css/[name].[hash].css`,
  }),
  new CopyWebpackPlugin([
    {from: `${PATHS.src}/image`, to: `${PATHS.assets}image`},
    //{from: `${PATHS.src}/static`, to: ``},
  ]),
  new HtmlWebpackPlugin({
    template: `${PATHS.src}/index.html`,
    filename: './index.html',
    inject: false
  }),
];

// Входной файл (их может быть несколько)
var entry = {
  'bundle': PATHS.src+'/Main.jsx'
};

// Выходные файлы (из каждого входного может получаться несколько выходных)
var output = {  
  path: PATHS.dist,
  filename: `${PATHS.assets}js/[name].[hash].js`,
  publicPath: '/',
};

// Выделение библиотек из /node_modules/ в отдельный файл (React,Popper,jQuery и т.д.)
// Стоит почитать побольше 
var optimization = {
  splitChunks: {
    cacheGroups:{
      vendor:{
        name: "vendor",
        test: /node_modules/,
        chunks: "all",
        enforce: true,
      }
    }
  }
}

// Правила обработки для файлов с разным расширением
var mod = {
  rules:[
    // .JS и .JSX файлы обрабатываются babel-loader (его конфигурация находится в .babelrc)
    // babel переводит jsx в js, а также совмещает текущий js код со старой версией EcmaScript
    {test: /\.jsx?$/, exclude: /node_modules/, use: {
        loader: 'babel-loader',
        options: require("./babel.config.js")
      }
    },
    // GLOBAL
    // css-loader - собирает все зависимости в один файл (раскрывает import, url, require);    
    // style-loader - добавляет полученный CSS в конец document.head в тег style (рассмотреть замену на MiniCSSExtract)    
    //**********
    {test: /\.min.css$/, use: ['style-loader', 'css-loader']},
    // .module.css файлы используются для React компонентов 
    //    css-loader?modules - флаг modules говорит что CSS является модульным (обычно используется в React компонентах и шифрует все CSS селекторы)
    //    то бишь стили для класса .main_header в разных модулях не будут пересекаться друг с другом
    {test: /\.module.css$/, exclude: /node_modules/, use: ['style-loader','css-loader?modules']},
    // sass-loader преобразует Sass/SCSS в чистый CSS   (Syntactically Awesome Style Sheets)
    //    sass добавляет к простому css переменные, вложенности, фрагментирование (выделение части, допустим переменных, в отдельный файл),
    //    миксины (одно свойство с префиксами всех браузеров), наследование стилей и математические операторы.
    {test: /\.scss$/, use: [
      MiniCssExtractPlugin.loader, 
      {
        loader: 'css-loader', 
        options: {sourceMap:true},
      },
      {
        loader:'postcss-loader',
        options: {sourceMap:true, config: {path: PATHS.currentirectory+'/postcss.config.js'}}
      },
      {
        loader:'sass-loader',
        options: {sourceMap:true}
      }
    ]},
    {test: /\.(png|jpg|gif|svg)$/,loader: 'file-loader',options: {name: '[name].[ext]'} }  
  ]
};

// позволяет не указывать расширения файлов в import и require
var resolve = {extensions: ['.js','.jsx','.scss']};

// Webpack не предупреждает если файл стал большим
var performance = {
  hints: false
};

module.exports = {  
  entry: entry,                   // Входные файлы
  output: output,                 // Выходные файлы
  module: mod,                    // Алгоритмы обработки файлов
  plugins: plugins,               // Плагины используемые при обработке
  resolve: resolve,               // Расширения по умолчанию
  optimization: optimization,     // Оптимизация: разделение на файлы (в будущем функционал будет расширяться)
  performance: performance,       // Отключение уведомлений (О большом файле надоело)
  externals: externals,
};