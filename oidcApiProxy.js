const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');

function tryParseJson(obj) {
  try {
    return JSON.parse(obj);
  } catch (err) {
    return null;
  }
}

module.exports = function createApiProxy(target, stateCookie = 'oidcState') {
  const router = express.Router();

  router.use(cookieParser());

  router.all('*', (req, res) => {
    const oidcState = req.cookies[stateCookie];
    if (!oidcState) {
      return res.status(401).send({ error: 'Missing oidc cookie' });
    }

    const state = tryParseJson(oidcState);
    if (!state || !state.jwt) {
      return res.status(400).send({ error: 'Unable to parse OIDC state' });
    }

    return axios({
      method: req.method,
      url: `${target}/api/v1/user/${state.jwt.sub}${req.path}`,
      validateStatus: () => true, // never error-out (always pass-thru)
      headers: {
        Authorization: `Bearer ${state.access_token}`,
      },
    }).then((resp) => {
      res.status(resp.status).send(resp.data);
    }).catch((err) => {
      res.status(503).send({ error: `Error communicating with host: ${err}` });
    });
  });

  return router;
};
