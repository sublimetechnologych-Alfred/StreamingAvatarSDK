export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const response = await fetch("https://api.heygen.com/v1/streaming.create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HEYGEN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sdp: req.body.sdp,
        avatar_name: "default", // puoi cambiarlo se vuoi un avatar specifico
        voice_id: "5c1ade5e514c4c6c900b0ded224970fd", // Theo - Friendly
      }),
    });

    const result = await response.json();
    console.log("HeyGen response:", result);

    if (!result || !result.data || !result.data.sdp) {
      return res.status(500).json({ error: "Nessun SDP restituito da HeyGen", raw: result });
    }

    return res.status(200).json({ sdp: result.data.sdp });
  } catch (err) {
    console.error("Errore in /api/session:", err);
    return res.status(500).json({ error: "Errore nella creazione sessione" });
  }
}
