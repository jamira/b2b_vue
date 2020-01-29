module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/',
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