module.exports = {
    entry: "./app/index.js",
    output: {
        filename: './public/build.js'
    },

    devtool: 'source-map',
    watch: true,

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }, {
                test: /\.css$/,
                loader: 'style!css!autoprefixer?browsers=last 2 versions'
            }
        ]
    }
};