module.exports = {
    devServer: {
        proxy: {
            '/api/ferry': {
                target: 'https://www.majesticfastferry.com.sg:44326/',
                pathRewrite: { '^/api/ferry': '' },
                changeOrigin: true,
                ws: true
            },
            '/thk': {
                target: 'http://47.52.109.16/api/',
                pathRewrite: { '^/thk': '' },
                changeOrigin: true,
                ws: true
            }
        }
    }
}