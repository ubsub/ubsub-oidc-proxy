#!/usr/bin/env node
const path = require('path');
const express = require('express');
const axios = require('axios');
const oidcproxy = require('./index');
const config = require('./config').proxy;

const app = express();

// TODO: eslint

if (config.static) {
  console.log(`Serving ${config.static}...`);
  app.use(express.static(config.static));
} else if (config.forward) {
  console.log(`Forwarding requests to ${config.forward}...`);
  app.use((req, res, next) => {
    axios(req.method, config.forward + req.path, {
      headers: req.headers,
    }).then((resp) => {
      res.send(resp.data);
    }).catch((err) => {
      if (err.response.status === 404) {
        next();
      } else {
        res.status(err.response.status).send(err.response.data);
      }
    });
  });
} else {
  console.log('No proxy config set via --static or --forward, serving example...');
  app.use(express.static(path.join(__dirname, 'public')));
}

app.use(config.path, oidcproxy());

app.listen(config.port, () => {
  console.log(`Listening on http://0.0.0.0:${config.port}`);
});
