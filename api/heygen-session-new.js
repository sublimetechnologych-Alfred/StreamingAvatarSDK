export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });

  try {
    const { token, avatar_id, voice_id } = req.body || {};
    if (!token) return res.status(400).json({ error: "Missing token" });

    const payload = {
      version: "v2",
      avatar_id, // opzionale: puoi passarci il tuo Alfred
      voice: voice_id ? { voice_id, rate: 1.0 } : undefined,
      video_encoding: "H264",
      quality: "high"
    };

    const r = await fetch("https://api.heygen.com/v1/streaming.new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const txt = await r.text();
    let json; try { json = JSON.parse(txt); } catch { json = null; }

    if (!r.ok) {
      return res.status(r.status).json({ ok: false, status: r.status, raw: json || txt });
    }

    // Risposta attesa con session_id, url LiveKit, access_token, ecc.
    return res.status(200).json(json);
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
