const path = require('path')

module.exports = {
    mode: 'none',
    entry: ['@babel/polyfill', './CarWash/Client/src/App.jsx'],
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['*', '.ts']
    },
    output: {
        path: path.resolve(`${__dirname}/client/`, 'build'),
        filename: 'bundle.js'
    }
}