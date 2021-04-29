const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: {
            root: 'Laraberg',
            amd: 'laraberg-js',
            commonjs: 'laraberg-js',
        },
    },
    devServer: {
        publicPath: '/dist/',
        compress: true,
        port: 9001,
        injectClient: false,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx'
        ],
        fallback: {
            path: false
        }
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'styles.css'})
    ]
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = false
    }

    return config
};
