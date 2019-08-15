#!/usr/bin/env node
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const oidcRouter = require('./index');
const { backend, oidc } = require('./config');

const app = express();

if (backend.log && backend.log.format) {
  app.use(morgan(backend.log.format));
}

// Authentication endpoint
app.use(backend.path, oidcRouter(oidc));

// Proxying
if (backend.static) {
  console.log(`Serving ${backend.static}...`);
  app.use(express.static(backend.static));
} else if (backend.proxy && backend.proxy.target) {
  console.log(`Forwarding requests to ${backend.proxy}...`);

  // eslint-disable-next-line global-require
  const proxy = require('http-proxy-middleware'); // optional dep
  app.use(proxy(backend.proxy));
} else {
  console.log('No backend config set via --backend.static or --backend.proxy.target, serving example...');
  app.use(express.static(path.join(__dirname, 'public')));
}

app.listen(backend.port, () => {
  console.log(`Listening on http://localhost:${backend.port}`);
});
