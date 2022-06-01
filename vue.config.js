const webpack = require('webpack')
const Config = require('./src/common/config')
const accessOrigin = Config.ACCESS_ORIGIN
module.exports = {
    publicPath: './',
    lintOnSave: false,
    // webpack配置节点
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                'window.Quill': 'quill/dist/quill.js',
                'Quill': 'quill/dist/quill.js'
            })
        ]
    },
    devServer: {
        // 项目运行时候的端口号
        port: 9009,
        public: 'http://0.0.0.0:9009',
        proxy: {
            '/yb-company' : {
                target: accessOrigin,
                changeOrigin: true
            },
            'yb-business': {
                target: accessOrigin,
                changeOrigin: true
            },
            '/yibai-web' : {
                target: accessOrigin,
                changeOrigin: true
            },
            '/yb-vms' : {
                target: accessOrigin,
                changeOrigin: true
            },
            '/djb_company' : {
                target: accessOrigin,
                changeOrigin: true
            },
            '/loc' : {
                target: accessOrigin,
                changeOrigin: true,
                pathRewrite: {
                    '^/loc': ''
                }
            },
            '/djb' : {
                target: accessOrigin,
                changeOrigin: true
            }
        }
    }
};
