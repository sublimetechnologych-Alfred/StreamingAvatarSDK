export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const { sdp, type } = req.body;

    // chiave API di HeyGen
    const apiKey = process.env.HEYGEN_API_KEY;

    // chiamata a HeyGen
    const response = await fetch("https://api.heygen.com/v1/streaming.avatar.session.create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_config: {
          avatar_name: "default",
          voice_id: "5c1ade5e514c4c6c900b0ded224970fd", // Theo - Friendly
          language: "Multilingual"
        },
        sdp: { type, sdp }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Errore HeyGen:", data);
      return res.status(500).json({ error: "Errore da HeyGen", detail: data });
    }

    // risposta verso il browser
    return res.status(200).json({
      session_id: data.data.session_id,
      sdp: data.data.sdp
    });

  } catch (error) {
    console.error("Errore in /api/session:", error);
    res.status(500).json({ error: "Errore nella creazione sessione", detail: error.message });
  }
}
