const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'H2GLO/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`;
    const r = await get(url);
    const d = JSON.parse(r.body);
    const street = d.address && (d.address.road || d.address.pedestrian || d.address.footway || d.address.path || null);
    return res.json({ street: street || null });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
