// blog-frontend/server.js
// Custom Node.js server for cPanel Node.js Selector deployment
// This file is optional - cPanel can also use 'next start' directly

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Production mode for cPanel deployment
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const app = next({
  dev,
  hostname,
  port,
  // Ensure production optimizations
  conf: {
    reactStrictMode: false,
  }
});

const handle = app.getRequestHandler();

// Start server
app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log(`> Next.js server ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  process.exit(1);
});

