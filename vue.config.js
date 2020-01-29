module.exports = {
    devServer: {
        proxy: {
            '/api/ferry': {
                target: 'https://www.majesticfastferry.com.sg:44326/',
                pathRewrite: { '^/api/ferry': '' },
                changeOrigin: true,
                ws: true
            }
        }
    }
}