export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sdp, type } = req.body;

    const resp = await fetch("https://api.heygen.com/v1/streaming.new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HEYGEN_API_KEY}`
      },
      body: JSON.stringify({
        sdp,
        type,
        voice: "5c1ade5e514c4c6c900b0ded224970fd", // Theo - Friendly
        avatar_name: "default" // opzionale, puoi cambiarlo
      })
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Errore HeyGen:", data);
      return res.status(500).json({ error: "Errore creazione sessione HeyGen", details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Errore API /api/session:", err);
    return res.status(500).json({ error: "Errore interno server" });
  }
}
