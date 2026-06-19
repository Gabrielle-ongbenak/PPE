const http = require('http');

const BASE = process.env.API_URL || 'http://localhost:3000';

const request = (method, path, body, token) =>
  new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => { raw += chunk; });
        res.on('end', () => {
          let parsed = raw;
          try { parsed = JSON.parse(raw); } catch (_) { /* keep raw */ }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });

const run = async () => {
  const tests = [];

  const health = await request('GET', '/');
  tests.push({ name: 'Health check', ok: health.status === 200 });

  const plans = await request('GET', '/api/subscriptions/plans');
  tests.push({ name: 'Subscription plans', ok: plans.status === 200 });

  const search = await request('GET', '/api/publications/recherche');
  tests.push({ name: 'Public search', ok: search.status === 200 });

  const failed = tests.filter((t) => !t.ok);
  tests.forEach((t) => console.log(t.ok ? '✓' : '✗', t.name));
  if (failed.length) {
    console.error(`${failed.length} test(s) failed`);
    process.exit(1);
  }
  console.log('All smoke tests passed');
};

run().catch((err) => {
  console.error('Smoke test error:', err.message);
  process.exit(1);
});
