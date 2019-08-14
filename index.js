const URL = require('url');
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const defaultConfig = require('./config');

module.exports = function buildOidcProxy(opts = defaultConfig.oidc) {
  const router = express.Router();

  function validateConf(item) {
    if (!opts[item]) {
      console.error(`WARNING: Missing required config '${item}'!  OIDC Middleware may not work`);
    }
  }
  validateConf('client_id');
  validateConf('client_secret');
  validateConf('auth_url');
  validateConf('token_url');


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
    const { state, code } = req.query;
    // TODO: Validate state

    axios.post(opts.token_url, {
      client_id: opts.client_id,
      client_secret: opts.client_secret,
      grant_type: 'authorization_code',
      code,
    }).then((resp) => {
      const token = resp.data;
      return new Promise((resolve, reject) => {
        jwt.verify(token.id_token, opts.client_secret, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          if (opts.parseToken) {
            token.jwtDecoded = decoded;
          }
          return resolve(token);
        });
      });
    }).then((token) => {
      res.send(token);
    }).catch(next);
  });

  return router;
};
