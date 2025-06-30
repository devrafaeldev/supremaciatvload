import https from 'https';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const targetUrl = req.url?.slice(1);
  if (!targetUrl) {
    return res.status(400).send('URL inválida');
  }

  const pathParts = targetUrl.split('/').filter(Boolean);
  const channel = pathParts[0];
  const restPath = pathParts.slice(1).join('/');

  if (!channel || !restPath) {
    return res.status(400).send('Caminho incompleto');
  }

  const tryFetchHtml = async (path) => {
    try {
      const apiUrl = `https://d1r94zrwa3gnlo-cloudfront.vercel.app/host/${path}/${channel}`;
      const response = await fetch(apiUrl, {
        agent: new https.Agent({ rejectUnauthorized: false }),
      });
      if (!response.ok) throw new Error('Falha na resposta');
      const html = await response.text();
      const match = html.match(/https?:\/\/[^\/]+\/[^\/]+/);
      if (match) return match[0];
    } catch (err) {
      return null;
    }
  };

  try {
    // Tenta primeiro com 'cpx'
    let baseUrl = await tryFetchHtml('cpx');

    // Se não funcionar, tenta com 'ke'
    if (!baseUrl) {
      baseUrl = await tryFetchHtml('ke');
    }

    if (!baseUrl) {
      return res.status(404).send('Base de URL não encontrada');
    }

    const destinationUrl = `${baseUrl}/${restPath}`;
    const proxyResponse = await fetch(destinationUrl, {
      headers: {
        'User-Agent': '*',
        'Referer': 'https://embedcanaistv.com/',
      },
      agent: new https.Agent({ rejectUnauthorized: false }),
    });

    const contentType = proxyResponse.headers.get('content-type') || 'application/octet-stream';
    const buffer = await proxyResponse.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.status(proxyResponse.status).send(Buffer.from(buffer));
  } catch (error) {
    console.error('Erro interno:', error);
    res.status(500).send('Erro interno no servidor');
  }
}
