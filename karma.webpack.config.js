const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        plugins: [
            new TsConfigPathsPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    stats: {
        errorDetails: true
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    devtool: 'eval-source-map'
};
