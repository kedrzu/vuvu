var Typescript = require("awesome-typescript-loader");

module.exports = {
    entry: [__dirname + '/test/ioc/ioc.test.ts'],
    output: {
        filename: "foo.js"
    },
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
            }
        ]
    },
    plugins: [
        new Typescript.CheckerPlugin(),
    ],
    devtool: 'source-map'
};