// /.netlify/functions/translate — DeepL Free example
export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') return resp(405, { error: 'POST only' });

    const { text, source, target } = JSON.parse(event.body || '{}') || {};
    if (!text || !target) return resp(400, { error: 'Missing text/target' });

    const key = process.env.DEEPL_API_KEY; // set in Netlify env vars (Step D)
    if (!key) return resp(500, { error: 'No API key configured' });

    const url = 'https://api-free.deepl.com/v2/translate';
    const params = new URLSearchParams();
    params.append('auth_key', key);
    params.append('text', text);
    params.append('target_lang', target.toUpperCase());
    if (source) params.append('source_lang', source.toUpperCase());

    const r = await fetch(url, { method: 'POST', body: params });
    if (!r.ok) return resp(r.status, { error: 'Provider error' });

    const data = await r.json();
    const out = data?.translations?.[0]?.text || text;
    return resp(200, { text: out });
  } catch {
    return resp(500, { error: 'Server error' });
  }
}
function resp(status, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body)
  };
}

