const path = require('path');

module.exports = {
    mode: "production",
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
        ],
    },
    entry: {
        main: './ts/main.ts',
        watchPage: './ts/watch-page.ts'
    },
    output: {
        filename: './assets/ts-dist/[name].bundle.js',
    },
};