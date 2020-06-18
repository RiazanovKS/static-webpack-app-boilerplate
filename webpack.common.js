const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { fstat } = require('fs')

const rootAssetsPath = path.resolve(__dirname, 'src/assets')
const scssUtilsPath = path.resolve(__dirname, 'src/utils/scss')

const getScssUtilsFiles = () =>
    fs.readdirSync(scssUtilsPath, (files) => {
        files.map(file => file.name)
    })

const plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/UI/pages/index.pug'),
        filename: 'index.html'
    })
]

const cssLoader = {
    test: /\.(s)?css$/,
    exclude: /node_modules/,
    use: [
        'css-loader',
        'postcss-loader',
        {
            loader: 'sass-loader',
            options: {
                prependData: getScssUtilsFiles()
                    .map(fileName => `@import \"${fileName}\";`)
                    .toString()
                    .replace(/\,/g, ""),
                sassOptions: {
                    includePaths: [path.resolve(__dirname, 'src/utils/scss')]
                }
            }
        },
    ]
}

const pugLoader = {
    test: /\.pug$/,
    use: {
        loader: 'pug-loader',
        options: {
            root: path.resolve(__dirname, 'src/UI'),
        }
    }
}

const jsLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader'
    }
}

const fileLoader = {
    test: /\.(jpg|png|svg|gif|woff(2)?|eot|ttf|otf)$/,
    loader: 'file-loader',
    options: {
        name: '[name].[ext]'
    }

}

const resolve = {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.json', '.scss', '.sass', 'css', '.pug']
}

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
        publicPath: '/'
    },
    resolve,
    plugins,
    module: {
        rules: [cssLoader, jsLoader, fileLoader, pugLoader]
    }
}