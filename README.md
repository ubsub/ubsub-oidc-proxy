# Ubsub OIDC Proxy

[![Build Status](https://travis-ci.org/ubsub/ubsub-oidc-proxy.svg?branch=master)](https://travis-ci.org/ubsub/ubsub-oidc-proxy)
[![npm](https://img.shields.io/npm/v/ubsub-oidc-proxy.svg)](https://www.npmjs.com/package/ubsub-oidc-proxy)
[![npm](https://img.shields.io/npm/l/ubsub-oidc-proxy.svg)](https://www.npmjs.com/package/ubsub-oidc-proxy)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/ubsub-oidc-proxy.svg)

The Ubsub OIDC proxy is a simple utility that can be used as a http server (for static files), a reverse-proxy (http endpoint), or as a middleware.  Given the correct configuration it will manage the OIDC authentication for ubsub, and store the result in a way the frontend can access and validate against it.

## Installing

```sh
npm install ubsub-oidc-proxy
```

## Usage

See configuration below for full details.  As an easy-start, I recommend creating `.oidcproxyrc` file at the base of your project, and setting it as so:

```toml
[oidc]
client_id=xxx
client_secret=xxx
redirect_base=http://example.com/auth
scope=user topic.*
```

### Standalone

As an easy way to test, you can run it standalone and it will serve a dummy-page.  This will make sure OIDC is set up correctly.

```sh
npm install -g ubsub-oidc-proxy
ubsub-oidc-proxy --oidc.client_id=xxx --oidc.client_secret=xxx
```

or, if you're an `npx` fan...

```sh
npx ubsub-oidc-proxy --oidc.client_id=xxx --oidc.client_secret=xxx
```

### As a file server

If, for instance, you want to serve a folder of static files (eg `dist/`), you could install globally, or as module, and run:

```sh
ubsub-odic-proxy --backend.static dist/
```

By default, this will mount the auth router on `/auth`. If that conflicts with your application, you can change that with `--backend.path`

### As a proxy

Alternatively, if your backend is being served on a port, you can access it via the built in proxy.

```sh
ubsub-oidc-proxy --backend.proxy.target http://localhost:8080
```

### As a middleware

If you chose to use it as a middleware to your express app, you can use it by passing the set of `oidc` parameters you can find in [config.js](config.js).

```js
#!/usr/bin/env node
const express = require('express');
const oidcRouter = require('ubsub-oidc-proxy');

const app = express();

// Authentication endpoint
app.use('/auth', oidcRouter(oidc));

app.listen(8080, () => {
  console.log('Listening on http://0.0.0.0:8080');
});
```

## Configuration

Configuration with ubsub uses [rc](https://www.npmjs.com/package/rc), so config can be provided via environment, `.oidcproxyrc` (ini or json), or minimist-like arguments.

See [config.js](config.js) for a full set of options.

At minimum, you need to set the following:

 * `client_id` Client ID obtained from ubsub.io
 * `client_secret` Client secret obtained from ubsub.io
 * `redirect_base` Where OIDC flow should redirect back to upon finishing
 * `scope` (Optional) You probably want to request more scopes than just *user*

## Using in client

By default, once you have been authenticated the proxy will store the JSON blob in the cookie `oidcState` (*config.oidc.storeName*).

This object looks like:

```json
{
  "access_token": "long-access-token",
  "id_token": "encoded.jwt.string",
  "expires_in": "2069-08-15T01:09:36.105Z",
  "token_type": "Bearer",
  "jwt": {
    "iat": 1565831376,
    "aud": "test",
    "iss": "app.ubsub.io",
    "sub": "token-id"
  }
}
```

In javascript, you can make calls either back through the api proxy (if configured), or directly to the router if your application is allowed to make CORS requests.

## API Proxy

By default, the oidc-proxy will expose the `/api` endpoint, which will automatically parse the state cookie, and forward requests to the router scoped to your current user and token.

You can use this endpoint on the frontend to avoid the need to worry about CORS, but be wary of the size of payload that may need to traverse your proxy and consider calling the router directly instead.

# Advanced usage

## Mounting path for high-performance static sites

There may be a case where you don't want the proxy to actually serve your content, but rather act simply at the auth endpoint and let something else serve the content (eg *nginx*).  To do this, any popular reverse-proxy will allow path-based proxying, and you simply need to proxy `backend.path`.

For example:

```
server {
  server_name example.com;
  location / {
    root /var/www;
  }
  location /auth {
    proxy_pass localhost:3050;
  }
}
```

# License

Copyright (c) 2019 Christopher LaPointe

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
