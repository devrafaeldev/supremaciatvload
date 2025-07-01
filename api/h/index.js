import https from 'https';

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
  if (!targetUrl) return res.status(400).send('URL inválida ou foi desligado.');

  const destinationUrl = `https://embedcanaistv.com/${targetUrl}/`;

  const options = {
    headers: {
      'User-Agent': '',
      'Referer': 'https://embedcanaistv.com/',
      'Host': 'embedcanaistv.com'
    }
  };

  function fetchHtml(url, options) {
    return new Promise((resolve, reject) => {
      https.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  try {
    const html = await fetchHtml(destinationUrl, options);

    // Regex mais amplo para capturar qualquer link m3u8
    const match = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/i);

    if (match && match[0]) {
      res.setHeader('Content-Type', 'text/plain');
      res.send(match[0]);
    } else {
      res.status(404).send('Link .m3u8 não encontrado no HTML.');
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao processar:', error);
    }
    res.status(500).send('Erro interno no servidor');
  }
}
