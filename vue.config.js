let proxyObj = {};
proxyObj['/ws'] = {
  ws: true,
  // target: "ws://localhost:8081"
  target: "http://47.110.235.163:8081"
};
proxyObj['/api'] = {
  ws: false,
  // target: 'http://localhost:8081',
  target: 'http://47.110.235.163:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: "dist",
  assetsDir: "static",
  indexPath: 'index.html',
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  }
}