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
  const email = (req.query.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ valid: false, reason: 'No email provided' });

  // Basic format check first
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.json({ valid: false, reason: 'Invalid format' });
  }

  try {
    const r = await get('https://api.disify.com/api/email/' + encodeURIComponent(email));
    const d = JSON.parse(r.body);
    if (!d.format) return res.json({ valid: false, reason: 'Invalid format' });
    if (d.disposable) return res.json({ valid: false, reason: 'Disposable email addresses are not accepted' });
    if (!d.dns) return res.json({ valid: false, reason: 'Email domain does not exist' });
    return res.json({ valid: true });
  } catch (e) {
    // If the check service is down, fall back to format-only
    return res.json({ valid: true, fallback: true });
  }
};
