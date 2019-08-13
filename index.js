const express = require('express');

export default function buildOidcProxy(config = {}) {
  const router = express.Router();

  router.get('/login', (req, res) => {

  });

  return router;
}
