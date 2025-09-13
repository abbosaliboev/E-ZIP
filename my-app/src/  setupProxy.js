const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.ezip.kro.kr',
      changeOrigin: true,
      secure: true,
      // localhost:3000/api/... -> https://api.ezip.kro.kr/api/...
      pathRewrite: { '^/api': '/api' },
      logLevel: 'debug',
    })
  );
};