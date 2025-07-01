// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    "/tour",                      // 클라이언트에서 이 경로로 요청하면…
    createProxyMiddleware({
      target: "https://apis.data.go.kr/B551011/KorService2",  // v2 엔드포인트
      changeOrigin: true,         
      secure: false,              // SSL 인증서 무시(필요하다면)
      pathRewrite: {
        '^/tour': '',             // → 타겟 URL 뒤에 /tour 없이 붙도록
      },
      logLevel: 'debug',          // 디버깅용으로 켜두면 요청 로그가 콘솔에 뜹니다
      onError(err, req, res) {
        console.error('Proxy error:', err);
      },
    })
  );
};
