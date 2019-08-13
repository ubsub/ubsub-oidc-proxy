const URL = require('url');
const express = require('express');
const axios = require('axios');
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

  router.get('/validate', (req, res, next) => {
    const state = req.query.state;
    const code = req.query.code;
    // TODO: Validate state

    axios.post(opts.token_url, {
      client_id: opts.client_id,
      client_secret: opts.client_secret,
      grant_type: 'authorization_code',
      code: code,
    }).then(resp => {
      // TODO: Validate JWT
      res.send(resp.data);
    }).catch(next);
  });

  return router;
};
