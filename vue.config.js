let proxyObj = {};
proxyObj['/ws'] = {
  ws: true,
  // target: "ws://localhost:8081"
  target: "http://47.110.235.163:8081"
};
proxyObj['/'] = {
  ws: false,
  // target: 'http://localhost:8081',
  target: 'http://47.110.235.163:8081',
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