const express = require('express');

module.exports = function buildOidcProxy(config = {}) {
  const router = express.Router();

  router.get('/login', (req, res) => {
    res.send('login?');
  });

  return router;
};
