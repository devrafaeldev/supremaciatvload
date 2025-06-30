import https from 'https';

export default function handler(req, res) {
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
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } else {
    return res.status(403).send('Acesso negado');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = req.url?.slice(1); // Remove a primeira barra "/"
  if (!targetUrl) {
    return res.status(400).send('URL inválida');
  }

  const destinationUrl = `https://b.tvcasecors.workers.dev/${targetUrl}`;

  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': 'https://b.tvcasecors.workers.dev/',
      'Origin': '',
      'Host': 'b.tvcasecors.workers.dev'
    }
  };

  try {
    https.get(destinationUrl, options, (streamResponse) => {
      res.setHeader('Content-Type', streamResponse.headers['content-type'] || 'application/octet-stream');
      streamResponse.pipe(res);
    }).on('error', (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao fazer a requisição:', error);
      }
      res.status(500).send('Erro ao processar a solicitação');
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao configurar a requisição:', error);
    }
    res.status(500).send('Erro interno no servidor');
  }
}
