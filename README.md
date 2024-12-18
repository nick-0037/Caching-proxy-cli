# Caching-proxy 

A simple CLI (Command-line-interface) caching proxy server to enhance API performance by caching responses and reducing redundant requests to the origin server.
https://roadmap.sh/projects/caching-server

## Features 

- Cache API response with configurable TTL (time-to-live).
- Simple CLI for running the proxy server and managing cache.
- Logs cache hits and misses for better observability.

## Installation 

1. Clone the repository:
  ```bash
  git clone https://github.com/nick-0037/Caching-proxy-cli.git
  cd caching-proxy-cli
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

## Usage

**Starting the proxy server**
Run the server using the following command:

```bash
node server.js --port <number> --origin <url>
```

**Options:**

- `--port` (optional): Port number for the proxy server. Defaults to 3000.
- `--origin` (requerid): URL of the origin server to forward requests to.
- `--clear-cahe`: Clears all cached responses and exits.


**Examples**

1. Start the proxy on port 4000 and forward requests to https://dummyjson.com:
```bash
node server.js --port 4000 --origin https://dummyjson.com
```

2. Clear the cache:
```bash
node server.js --clear-cache
```


**Using as a Global CLI Command**

To make the CLI accessible globally and run it without the node prefix, you can use npm link:

1. Link the CLI globally:

```bash
npm link
```

2. Use the caching-server command to start the proxy:

```bash
caching-server --port 4000 --origin https://dummyjson.com
```

3. Clear the cache using the global command:

```bash
caching-server --clear-cache
```

