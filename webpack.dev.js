const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => { // module.exports is function now to pass in env variable from cli defined in package.json
    return merge(common(), {
        devtool: 'source-map',
        devServer: {
            contentBase: './dist',
            hot: true
        },
        mode: 'development',
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
                            loader: 'style-loader'
                        }, {
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
                                    })
                                ]
                            }
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }, // any scss files to be excluded from renaming the classes
                    ]
                }
            ]
        },
        plugins: [
             new HtmlWebpackPlugin({
                title: 'title title title',
                template: './src/index.html',
            }),
            
            new webpack.HotModuleReplacementPlugin(),
            new webpack.EnvironmentPlugin({
                'NODE_ENV': env
            }),
            new CopyWebpackPlugin([{
                    from: '-/**/*.*',
                    context: 'src',
                },
                {
                    from: '.nojekyll',
                    context: 'src'
                },
                {
                    from: 'media/**/*.*',
                    context: 'src',
                },
                {
                    from: 'assets/**/*.*',
                    exclude: 'assets/Pew/css/',
                    context: 'src',
                }, {
                    from: 'assets/Pew/css/*.*',
                    context: 'src',
                    transform(content, path) {
                        console.log(content.toString());
                        return content.toString().replace(/\/pew\//g,'/Pew/');
                    }
                }
            ])
        ],
        output: {
            filename: '[name].js?v=[hash:6]',
            path: path.resolve(__dirname, 'dist')
        },
    });
};