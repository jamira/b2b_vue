module.exports = {
    devServer: {
        proxy: {
            '/api/ferry': {
                target: 'https://www.majesticfastferry.com.sg:44326/',
                pathRewrite: { '^/api/ferry': '' },
                changeOrigin: true,
                secure: false
            },
            '/api/countries': {
                target: 'https://restcountries.eu/',
                pathRewrite: { '^/api/countries': '' },
                changeOrigin: true,
            }
        }
    }
}