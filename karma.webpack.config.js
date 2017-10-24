var Typescript = require("awesome-typescript-loader");
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [
            // this plugin must exceptionally be loaded from here
            // otherwise TS paths config will not work
            new Typescript.TsConfigPathsPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader'
                    }
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        ts: 'awesome-typescript-loader'
                    }
                }
            },
        ]
    },
    stats: {
        errorDetails: true
    },
    plugins: [
        new Typescript.CheckerPlugin()
    ],
    devtool: 'eval-source-map'
};
