export default async function handler(req, res) {
  const API_KEY = process.env.HEYGEN_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "HEYGEN_API_KEY mancante" });
  }

  // Se è una POST senza body → crea nuova sessione
  if (req.method === "POST" && !req.body?.sdp) {
    try {
      const response = await fetch("https://api.heygen.com/v1/streaming.new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          "voice": { "voice_id": "5c1ade5e514c4c6c900b0ded224970fd" }, // Theo - Friendly
          "avatar_name": "default", // puoi cambiarlo se vuoi un avatar specifico
          "quality": "high",
        }),
      });

      const data = await response.json();
      if (!data.data) {
        return res.status(500).json({ error: "Impossibile creare la sessione", details: data });
      }

      return res.status(200).json({
        session_id: data.data.session_id,
        sdp: data.data.sdp,
      });
    } catch (err) {
      return res.status(500).json({ error: "Errore backend", details: err.message });
    }
  }

  // Se è una POST con SDP → invia l’answer al server HeyGen
  if (req.method === "POST" && req.body?.sdp) {
    try {
      const response = await fetch("https://api.heygen.com/v1/streaming.sdp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          session_id: req.body.session_id,
          sdp: req.body.sdp,
        }),
      });

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Errore SDP", details: err.message });
    }
  }

  return res.status(405).json({ error: "Metodo non supportato" });
}
