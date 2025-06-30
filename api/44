import https from 'https';

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://c2luywxwdwjsawnv.github.io',
    'https://futwebom.vercel.app',
    'https://developer-tools.jwplayer.com',
    'https://sinalpublicotv.vercel.app',
    'https://sinalpublico.vercel.app'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } else {
    return res.status(403).send('Acesso negado');
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const targetUrl = req.url?.slice(1); // Remove a primeira barra "/"
  if (!targetUrl) {
    return res.status(400).send('URL inválida');
  }

  const pathParts = targetUrl.split('/').filter(Boolean);
  const channel = pathParts[0];
  const restPath = pathParts.slice(1).join('/');

  if (!channel || !restPath) {
    return res.status(400).send('Acesso negado');
  }

  try {
    const apiUrl = `https://d1r94zrwa3gnlo-cloudfront.vercel.app/host/cpx/${channel}`;

    // Busca o HTML da página
    const apiResponse = await fetch(apiUrl);
    const html = await apiResponse.text();

    const match = html.match(/https?:\/\/[^\/]+\/[^\/]+/);
    if (!match) {
      return res.status(404).send('URL base não encontrada');
    }

    const baseUrl = match[0];
    const destinationUrl = `${baseUrl}/${restPath}`;

    const proxyResponse = await fetch(destinationUrl, {
      headers: {
        'User-Agent': '*',
        'Referer': 'https://embedcanaistv.com/',
      },
    });

    const contentType = proxyResponse.headers.get('content-type') || 'application/octet-stream';
    const data = await proxyResponse.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.status(proxyResponse.status).send(Buffer.from(data));

  } catch (error) {
    console.error('Erro interno:', error);
    res.status(500).send('Erro interno no servidor');
  }
}
