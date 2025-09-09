export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST" });

  try {
    const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.HEYGEN_API_KEY, // la metteremo su Vercel
      },
    });

    const txt = await r.text();
    let json; try { json = JSON.parse(txt); } catch { json = null; }

    if (!r.ok) {
      return res.status(r.status).json({ ok: false, status: r.status, raw: json || txt });
    }

    // Risposta attesa: { data: { token: "...", expires_at: ... }, ... }
    return res.status(200).json(json);
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
