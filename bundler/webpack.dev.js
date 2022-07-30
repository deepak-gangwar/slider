const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common')

module.exports = merge(
    commonConfiguration, 
    {
        // Reduces clutter in the terminal
        stats: 'errors-warnings',
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            devMiddleware: {
                writeToDisk: true
            },

            // devServer.open
            // Tells dev-server to open the browser after server had been started. 
            // Set it to true to open your default browser.
            open: true,

            // devServer.https
            // By default, dev-server will be served over HTTP. 
            // It can optionally be served over HTTPS by setting it to true
            https: false,
            
            // devServer.allowedHosts
            // This option allows you to whitelist services that are allowed to access the dev server.
            // When set to 'all' this option bypasses host checking. THIS IS NOT RECOMMENDED
            allowedHosts: 'all',
            
            // disable webpack's hot module replacement
            hot: false,

            // devServer.client
            // Allows to set log level in the browser, 
            // e.g. before reloading, before an error or when Hot Module Replacement is enabled.
            client:
            {
                logging: 'none',
                // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
                overlay: true,
                // Shows a full-screen overlay in the browser when there are compiler errors or warnings.
                progress: false
                // Prints compilation progress in percentage in the browser.
            },
        },

        plugins: [
            new CleanWebpackPlugin()
        ]
    }
)
