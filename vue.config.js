let proxyObj = {};
proxyObj['/ws'] = {
  ws: true,
  // target: "ws://localhost:8081"
  target: "ws://34.92.249.192:8081"
};
proxyObj['/'] = {
  ws: false,
  // target: 'http://localhost:8081',
  target: 'http://34.92.249.192:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/': ''
  }
}
module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  }
}