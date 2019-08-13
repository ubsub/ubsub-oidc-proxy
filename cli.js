#!/usr/bin/env node
const express = require('express');
const oidcproxy = require('./index');
const config = require('./config').proxy;

const app = express();

// TODO: eslint

if (config.static) {

}
if (config.forward) {

}

app.use(config.path, oidcproxy());

app.listen(config.port, () => {
  console.log(`Listening on http://0.0.0.0:${config.port}`);
});
