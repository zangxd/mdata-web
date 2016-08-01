/**
 * @Author:      xd.zang
 * @DateTime:    2016-03-20
 * @description: webpack config
 */

'use strict';

let path = require('path');
let glob = require('glob');
let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const debug = process.env.NODE_ENV !== 'production';

let getEntries= (globPath, pathDir) => {
  let entryFiles = glob.sync(globPath);
	let entries = {}, filename;

  entryFiles.forEach((filePath) => {
		filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
		entries[filename] = './' + filePath;
  });

	return entries;
};

let entries = getEntries('src/js/page/**/*.js', 'src/js/page/');

let chunks = Object.keys(entries);

let plugins = () => {
	let pages = Object.keys(getEntries('src/views/**/*.html', 'src/views/'));
	let r = [];

	pages.forEach((filePath) => {

		let conf = {
			filename: './views/' + filePath + '.html', //生成的html存放路径，相对于path
			template: './src/views/' + filePath + '.html', //html模板路径
			inject: false,	//js插入的位置，true/'head'/'body'/false
			minify: { //压缩HTML文件
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false //删除空白符与换行符
			}
		};

		if (filePath in entries) {
			conf.favicon = './src/img/favicon.ico';
			conf.inject = 'body';
			conf.chunks = ['vendors', filePath];
			conf.hash = true;
		}
		r.push(new HtmlWebpackPlugin(conf));

	});

	return r;
};

let config = {
	entry:entries,
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/static/',
		filename: 'js/[name].js',
		chunkFilename: 'js/[id].chunk.js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
			}, {
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('css!less')
			}, {
				test: /\.html$/,
				loader: "html"
			}, {
				test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
			}, {
				test: /\.(png|jpe?g|gif)$/,
				loader: 'url-loader?limit=8192&name=img/[name]-[hash].[ext]'
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({ //加载jq
			$: 'jquery'
		}),
		new CommonsChunkPlugin({
			name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
			chunks: chunks,
			minChunks: chunks.length // 提取所有entry共同依赖的模块
		}),
		new ExtractTextPlugin('css/[name].css'),

		debug ? () => {} : new UglifyJsPlugin({ //压缩代码
			compress: {
				warnings: false
			},
			except: ['$super', '$', 'exports', 'require'] //排除关键字
		}),
		new webpack.HotModuleReplacementPlugin() //热加载

	].concat(plugins()),

	// webpack-dev-server配置
	devServer: {
		contentBase: './',
		host: 'localhost',
		port: 9090,
		inline: true,
		hot: true
	}
};

module.exports=config;
