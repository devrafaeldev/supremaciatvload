import https from 'https';

export default async function handler(req, res) {
  // Libera acesso de qualquer origem
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde pré-verificações do navegador (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Remove a barra inicial da URL recebida
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

  try {
    // Busca o HTML com o link base
    const apiUrl = `https://d1r94zrwa3gnlo-cloudfront.vercel.app/host/ke/${channel}`;
    const apiResponse = await fetch(apiUrl);
    const html = await apiResponse.text();

    // Extrai a URL base do conteúdo HTML
    const match = html.match(/https?:\/\/[^\/]+\/[^\/]+/);
    if (!match) {
      return res.status(404).send('Base de URL não encontrada');
    }

    const baseUrl = match[0];
    const destinationUrl = `${baseUrl}/${restPath}`;

    // Faz a requisição final para o destino
    const proxyResponse = await fetch(destinationUrl, {
      headers: {
        'User-Agent': '*',
        'Referer': 'https://embedcanaistv.com/',
      },
    });

    const contentType = proxyResponse.headers.get('content-type') || 'application/octet-stream';
    const buffer = await proxyResponse.arrayBuffer();

    // Retorna a resposta final
    res.setHeader('Content-Type', contentType);
    res.status(proxyResponse.status).send(Buffer.from(buffer));
  } catch (error) {
    console.error('Erro interno:', error);
    res.status(500).send('Erro interno no servidor');
  }
}
