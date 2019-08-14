const URL = require('url');
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
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

  router.use(cookieParser());


  router.get('/', (req, res) => {
    const state = uuid();
    const uri = URL.parse(opts.auth_url, true);
    if (!uri.query) {
      uri.query = {};
    }
    uri.query.client_id = opts.client_id;
    uri.query.response_type = 'code';
    uri.query.scope = opts.scope;
    uri.query.redirect_uri = `${opts.redirect_base}/validate`;
    uri.query.state = state;

    res.cookie('ubsubOidcState', state, { httpOnly: true });
    res.redirect(URL.format(uri));
  });

  router.get('/validate', (req, res, next) => {
    const { state, code } = req.query;

    const cookiedState = req.cookies.ubsubOidcState;
    res.clearCookie('ubsubOidcState');
    if (state !== cookiedState) {
      return next(new Error('Failed to authenticate OIDC state cookie'));
    }

    return axios.post(opts.token_url, {
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
            token.jwt = decoded;
          }
          return resolve(token);
        });
      });
    }).then((token) => {
      if (opts.store === 'cookie') {
        res.cookie(opts.storeName, token);
      } else if (opts.store !== 'none') {
        console.log(`WARNING: Invalid store set ${opts.store}`);
      }
      res.redirect(opts.success_url);
    }).catch(next);
  });

  return router;
};
