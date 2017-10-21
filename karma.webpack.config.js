var Typescript = require("awesome-typescript-loader");

module.exports = {  
    resolve: {
        extensions: [".ts"],
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
                        loader: 'awesome-typescript-loader',
                        // options: {
                        //     configFileName: 'test/tsconfig.json'
                        // }
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
