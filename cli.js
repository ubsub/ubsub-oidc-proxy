#!/usr/bin/env node
const path = require('path');
const express = require('express');
const axios = require('axios');
const oidcRouter = require('./index');
const config = require('./config').backend;

const app = express();

// Authentication endpoint
app.use(config.path, oidcRouter(config.oidc));

// Proxying
if (config.static) {
  console.log(`Serving ${config.static}...`);
  app.use(express.static(config.static));
} else if (config.proxy && config.proxy.target) {
  console.log(`Forwarding requests to ${config.proxy}...`);
  const proxy = require('http-proxy-middleware'); // optional dep
  app.use(proxy(config.proxy));
} else {
  console.log('No backend config set via --static or --proxy, serving example...');
  app.use(express.static(path.join(__dirname, 'public')));
}

app.listen(config.port, () => {
  console.log(`Listening on http://0.0.0.0:${config.port}`);
});
