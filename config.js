module.exports = require('rc')('oidcproxy', {
  oidc: {
    // Ubsub (or other) OIDC settings
    auth_url: 'https://app.ubsub.io/oidc',
    token_url: 'https://app.ubsub.io/oidc/token',
    client_id: null,
    client_secret: null,
    // Where to request redirect back to
    redirect_base: 'http://localhost:3050/auth',
    // What scopes to request
    scope: 'user topic.*',
    // Options about how ubsub should display the authentication flow (eg. default, or blank)
    layout: null,
    // Where to store the token
    // 'cookie' Store in client-accessible JSON-encoded cookie
    store: 'cookie',
    storeName: 'oidcState',
    storeOpts: {}, // Any options for the specific store
    // If true, parse the JWT rather than passing directly
    parseToken: true,
    // Where to redirect to upon success
    success_url: '/',
    // Where to route on error. If no url, will pass error up next chain
    error_url: null,
  },
  backend: {
    // If proxying the request locally (as opposed to middleware), the port
    port: 3050,
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
    // By default, an endpoint /api will be exposed which will parse
    // the cookie for you, and pass along your session information
    apiProxy: {
      path: '/api',
      target: 'https://router.ubsub.io',
    },
    // Logging
    log: {
      format: 'short',
    },
  },
});
