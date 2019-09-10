const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {
    return merge(common(env), {
        mode: 'production',
        devtool: false,
        optimization: {
            minimizer: [
              new TerserPlugin({
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                  compress: {
                    drop_console: true,
                  },
                },
              }),
            ],
          },
        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: [/node_modules/, /\.min\./, /vendor/],
                    use: [{
                            loader: 'babel-loader',
                            /*options: {
                                plugins: [DynamicImport]
                            }*/
                        },
                        {
                            loader: 'eslint-loader'
                        }
                    ]
                },
                {
                test: /\.scss$/,
                //exclude: /exclude/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true

                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('postcss-preset-env')({
                                    autoprefixer: {
                                        grid: true
                                    }
                                }),
                                require('cssnano')()
                            ]
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'title title title',
                template: './src/index.html',
            }),
            new HtmlReplaceWebpackPlugin([
                    {
                        pattern: /\/?-\//,
                        replacement: ''
                    }
                ]),
            new CleanWebpackPlugin(['docs']),
            new CopyWebpackPlugin([{
                from: './**/*.*',
                to: './',
                context: 'src/-/'
            }, {
                from: 'assets/**/*.*',
                exclude: 'assets/Pew/css/',
                context: 'src',
            }, {
                from: 'assets/Pew/css/*.*',
                context: 'src',
                transform(content, path) {
                    console.log(content.toString());
                    return content.toString().replace(/url\("\/([^/])/g, 'url("/philly/$1').replace(/\/pew\//g,'/Pew/'); // this modifies the content of the files being copied; here making sure url('/...') is change
                                                                                           // to url(/docs/...').
                }
            }]),
            new webpack.SourceMapDevToolPlugin({
              filename: '[name]js.map',
            })
        ],
        output: {
            filename: '[name].js?v=[hash:6]',
            path: path.resolve(__dirname, 'docs'),
            // publicPath
        }
    });
};