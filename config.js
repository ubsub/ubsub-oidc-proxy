module.exports = require('rc')('oidcproxy', {
  oidc: {
    client_id: null,
    client_secret: null,
    request_scope: null,
    redirect_base: null,
    store: 'cookie',
    parseStore: true,
  },
  proxy: {
    port: 8080, // If proxying the request locally (as opposed to middleware), the port
    path: '/auth',
    static: null,
    forward: null,
  },
});
