const URL = require('url');
const express = require('express');
const uuid = require('uuid/v4');
const defaultConfig = require('./config');

module.exports = function buildOidcProxy(opts = defaultConfig.oidc) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const uri = URL.parse(opts.auth_url, true);
    if (!uri.query) {
      uri.query = {};
    }
    uri.query.client_id = opts.client_id;
    uri.query.response_type = 'code';
    uri.query.scope = opts.scope;
    uri.query.redirect_uri = `${opts.redirect_base}/validate`;
    uri.query.state = uuid();
    res.redirect(URL.format(uri));
  });

  router.get('/validate', (req, res) => {
    const state = req.query.state;
    const code = req.query.code;
    // TODO: Validate state
    const uri = URL.parse(opts.token_url, true);
    if (!uri.query) {
      uri.query = {};
    }
    uri.query.client_id = opts.client_id;
    uri.query.client_secret = opts.client_secret;
    uri.query.grant_type = 'authorization_code';
    uri.query.code = code;
    axios.get(URL.format(uri))
      .then(resp => {
        // TODO: Validate JWT
        res.send(resp.data);
      });
  });

  return router;
};
