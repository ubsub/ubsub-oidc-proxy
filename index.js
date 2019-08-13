const express = require('express');
const config = require('./config');

module.exports = function buildOidcProxy(opts = config.oidc) {
  const router = express.Router();

  router.get('/login', (req, res) => {
    res.send('login?');
  });

  return router;
};
