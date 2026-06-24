const dns = require('dns').promises;

// Known disposable email providers
const DISPOSABLE = new Set(['mailinator.com','guerrillamail.com','temp-mail.org','throwam.com',
  'yopmail.com','sharklasers.com','guerrillamailblock.com','grr.la','guerrillamail.info',
  'spam4.me','trashmail.com','trashmail.me','trashmail.net','dispostable.com','fakeinbox.com',
  'mailnull.com','spamgourmet.com','maildrop.cc','discard.email','tempmail.com','10minutemail.com',
  'tempinbox.com','throwam.com','tempr.email','dispostable.com']);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const email = (req.query.email || '').trim().toLowerCase();

  if (!email) return res.json({ valid: false, reason: 'No email provided' });

  // Format check
  const match = email.match(/^[^\s@]+@([^\s@]+\.[^\s@]{2,})$/);
  if (!match) return res.json({ valid: false, reason: 'Invalid email format' });

  const domain = match[1];

  // Disposable check
  if (DISPOSABLE.has(domain)) {
    return res.json({ valid: false, reason: 'Disposable email addresses are not accepted' });
  }

  // MX record check — confirms domain actually receives email
  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return res.json({ valid: false, reason: 'Email domain does not accept mail' });
    }
    return res.json({ valid: true });
  } catch (e) {
    // NXDOMAIN or ENOTFOUND = domain doesn't exist
    if (e.code === 'ENOTFOUND' || e.code === 'ENODATA' || e.code === 'ESERVFAIL') {
      return res.json({ valid: false, reason: 'Email domain does not exist' });
    }
    // DNS timeout or other error — fall back to accepting the email
    return res.json({ valid: true, fallback: true });
  }
};
