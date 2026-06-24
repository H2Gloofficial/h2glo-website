export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });

  const query = `[out:json][timeout:10];way[highway][name](around:300,${parseFloat(lat)},${parseFloat(lng)});out tags;`;
  try {
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query),
    });
    const data = await r.json();
    const streets = [...new Set(
      (data.elements || []).filter(e => e.tags && e.tags.name).map(e => e.tags.name)
    )].sort();
    return res.json({ streets });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
