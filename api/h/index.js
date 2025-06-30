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

  // Lista de domínios possíveis
  const domains = [
    'https://lb1.embmaxtv.online',
    'https://embmaxtv.online'
  ];

  // Seleciona um domínio aleatório
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const finalUrl = `${randomDomain}/${targetUrl}/index.m3u8`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(finalUrl);
}
