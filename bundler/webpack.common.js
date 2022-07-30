const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, '../app')
const dirAssets = path.join(__dirname, '../assets')
const dirShared = path.join(__dirname, '../shared')
const dirStyles = path.join(__dirname, '../styles')
const dirNode = 'node_modules'

module.exports = {
    entry: [
        path.join(dirApp, 'index.js'),
        path.join(dirStyles, 'index.scss')
    ],

    resolve: {
        modules:  [
            dirApp, 
            dirAssets,
            dirShared, 
            dirStyles, 
            dirNode
        ]
    },

    output:
    {
        // filename: '[name].[contenthash].js',
        filename: '[name].js',
        path: path.resolve(__dirname, '../public')
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),

        new webpack.ProvidePlugin({

        }),

        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../index.pug'),
            minify: true,
            inject: false
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './shared',
                    to: ''
                }
            ]
        }),
         
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),

        new HTMLInlineCSSWebpackPlugin()
    ],

    module: 
    {
        rules: 
        [

            // HTML
            {
                test: /\.(html)$/,
                use:
                [
                    'html-loader'
                ]
            },

            // PUG
            {
                test: /\.pug$/,
                use: 
                [
                    'pug-loader'
                ]
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.scss/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: ''
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            },

            // Images
            {
                test: /\.(.jpe?g|png|gif|svg|fnt|webp)$/,
                type: 'asset/resource',
                generator:
                {   
                    filename: 'images/[name][ext]'
                }
            },

            // Fonts
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },

            // Shaders
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            }
        ]
    }
}
