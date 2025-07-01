export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const targetUrl = req.url?.replace('/api/h/', '');
  if (!targetUrl) {
    return res.status(400).send('URL inválida ou foi desligado.');
  }

  const finalUrl = `https://embmaxtv.online/${targetUrl}/index.m3u8`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(finalUrl);
}
