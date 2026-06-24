const https = require('https');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'User-Agent': 'H2GLO-Streets/1.0',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(12000, () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });

  const query = `[out:json][timeout:10];way[highway][name](around:300,${lat},${lng});out tags;`;
  const body = 'data=' + encodeURIComponent(query);

  try {
    const r = await post('https://overpass-api.de/api/interpreter', body);
    if (r.status !== 200) return res.status(502).json({ error: 'Overpass error ' + r.status, raw: r.body.slice(0, 200) });
    const data = JSON.parse(r.body);
    const streets = [...new Set(
      (data.elements || []).filter(e => e.tags && e.tags.name).map(e => e.tags.name)
    )].sort();
    return res.json({ streets });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
