// module.exports = {
//     devServer: {
//         proxy: {
//             '/api/ferry': {
//                 target: 'http://47.52.109.16/api/ferry-api/',
//                 pathRewrite: { '^/api/ferry': '' },
//                 changeOrigin: true,
//                 ws: true
//             },
//             '/thk': {
//                 target: 'http://47.52.109.16/api/',
//                 pathRewrite: { '^/thk': '' },
//                 changeOrigin: true,
//                 ws: true
//             }
//         }
//     }
// }