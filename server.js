#!/usr/bin/env node

const express = require('express');
const axios = require('axios');
const minimist = require('minimist');
const NodeCache = require('node-cache');

// Parse CLI arguments
const args = minimist(process.argv.slice(2));
const port = args.port || 3000;
const origin = args.origin;
const clearCache = args['clear-cache'];

// Validate required arguments
if (clearCache) {
  console.log('Cleaning cache...');
  const cache = new NodeCache();
  cache.flushAll();
  console.log('Cache cleared');
  process.exit(0);
}

if (!origin) {
  console.error('Error: --origin is required to start the caching proxy server.');
  process.exit(1);
}


// Initialize cache and Express app
const cache = new NodeCache({ stdTTL: 300 });
const app = express();

app.use(express.json())

app.use(async (req, res) => {
  const cacheKey = `${req.method}:${req.originalUrl}`;
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    // Serve from cache
    console.log(`Cache HIT for ${req.originalUrl}`);
    res.set('X-cache', 'HIT');
    res.status(cachedResponse.status).set(cachedResponse.headers).send(cachedResponse.data);
  } else {
    // Forward request to origin server
    console.log(`Cache MISS for ${req.originalUrl}`);
    try {
      const originUrl = `${origin}${req.originalUrl}`;
      console.log(originUrl, 'originUrl');
      const { host, ...filteredHeaders } = req.headers;
      const response = await axios({
        method: req.method,
        url: originUrl,
        headers: filteredHeaders,
        data: req.body
      });

      // Cache the response
      cache.set(cacheKey, {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      res.set('X-Cache', 'MISS');
      res.status(response.status).set(response.headers).send(response.data);
    } catch (err) {
      console.error('Error fetching data from origin:', err.message);
      res.status(502).send('Bad Gateway');
    }
  }
});

app.listen(port, () => {
  console.log(`Caching proxy server running on port ${port}`);
  console.log(`Forwarding requests to origin: ${origin}`);
})