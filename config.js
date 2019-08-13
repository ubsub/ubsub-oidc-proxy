module.exports = require('rc')('oidcproxy', {
  oidc: {
    auth_url: 'https://app.ubsub.io/oidc',
    token_url: 'https://app.ubsub.io/oidc/token',
    client_id: null,
    client_secret: null,
    scope: 'user',
    redirect_base: 'http://localhost:8080/auth',
    store: 'cookie',
    parseStore: true,
  },
  backend: {
    port: 8080, // If proxying the request locally (as opposed to middleware), the port
    path: '/auth',
    static: null,
    proxy: { // config to http-proxy-middleware (http-proxy)
      target: null,
      changeOrigin: true,
    },
  },
});
