const autoprefixer = require('autoprefixer');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
const ENV_PRODUCTION = NODE_ENV === 'production';

const BUILD_DIR = process.env.BUILD_PATH || path.resolve(__dirname, 'dist/');
const APP_DIR = path.resolve(__dirname, 'public/');
const LOCAL_PATH = '/';
const BASE_URL = process.env.BASE_URL || (ENV_PRODUCTION ? '/' : LOCAL_PATH);

const config = {
    entry: {
        main: ["babel-polyfill", APP_DIR + '/src/index.jsx']
    },
    output: {
        path: BUILD_DIR,
        publicPath: '/',
        filename: '[name].js'
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    module: {
        rules: [
            // All files with a '.js' or '.jsx' extension will be handled by 'babel-loader'.
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            },
            // SASS / SCSS loader for webpack
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(APP_DIR + '/styles'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: true,
                            url: false
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                autoprefixer({
                                    browsers: ["> 0.1%"]
                                })
                            ]
                        }
                    }, {
                        loader: 'sass-loader'
                    }]
                })
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new BaseHrefWebpackPlugin({ baseHref: BASE_URL }),
        new CopyWebpackPlugin([
            {
                from: APP_DIR + '/assets/fonts',
                to: 'assets/fonts'
            }, {
                from: APP_DIR + '/assets/media',
                to: 'assets/media'
            }, {
                from: APP_DIR + '/src/maintenancePage.html',
                to: ''
            }, {
                from: APP_DIR + '/src/noSupportIEPage.html',
                to: ''
            },
            {
                from: APP_DIR + '/src/manifest.json',
                to: ''
            },
            {
                from: APP_DIR + '/src/serviceWorker.js',
                to: ''
            }
        ]),
        new HtmlWebpackPlugin({
            title: 'Elemental',
            template: APP_DIR + '/src/index.html'
        })
    ]
};

module.exports = config;
