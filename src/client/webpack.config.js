const path = require('path')

module.exports = {
    mode: 'none',
    entry: ['./src/client/RibClient.ts'],
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
        path: path.resolve(__dirname, '../../dist/client'),
        filename: 'RibClient.js'
    }
}