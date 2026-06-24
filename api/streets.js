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
  const postcode = (req.query.postcode || '').replace(/\s+/g, '').toUpperCase();
  if (!postcode) return res.status(400).json({ error: 'Missing postcode' });

  const apiKey = process.env.GETADDRESS_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Address lookup not configured' });

  try {
    const url = `https://api.getaddress.io/find/${encodeURIComponent(postcode)}?api-key=${apiKey}&expand=true`;
    const r = await get(url);
    if (r.status === 404) return res.json({ addresses: [] });
    if (r.status !== 200) return res.status(502).json({ error: 'Lookup failed' });
    const d = JSON.parse(r.body);
    const addresses = (d.addresses || []).map(function(a) {
      return [a.building_number, a.sub_building_number, a.sub_building_name, a.building_name, a.thoroughfare]
        .map(s => (s || '').trim()).filter(Boolean).join(' ');
    }).filter(Boolean).sort();
    return res.json({ addresses });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
