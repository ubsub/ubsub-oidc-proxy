module.exports = require('rc')('oidcproxy', {
  oidc: {
    // Ubsub (or other) OIDC settings
    auth_url: 'https://app.ubsub.io/oidc',
    token_url: 'https://app.ubsub.io/oidc/token',
    client_id: null,
    client_secret: null,
    // Where to request redirect back to
    redirect_base: 'http://localhost:8080/auth',
    // What scopes to request
    scope: 'user',
    // Where to store the token
    store: 'cookie',
    // If true, parse the JWT rather than passing directly
    parseStore: true,
  },
  backend: {
    port: 8080, // If proxying the request locally (as opposed to middleware), the port
    // Path for the authentication endpoint
    path: '/auth',
    // Static relative path to serve from
    static: null,
    // config to http-proxy-middleware (http-proxy)
    // See: https://www.npmjs.com/package/http-proxy-middleware
    proxy: {
      target: null,
      changeOrigin: true,
    },
  },
});
