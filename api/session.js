export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST consentito" });
  }

  try {
    const heygenRes = await fetch("https://api.heygen.com/v1/streaming.create_session", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HEYGEN_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        voice: {
          voice_id: "5c1ade5e514c4c6c900b0ded224970fd" // Theo - Friendly
        },
        avatar: {
          type: "default"
        }
      })
    });

    const data = await heygenRes.json();

    if (!heygenRes.ok) {
      console.error("Errore HeyGen:", data);
      return res.status(heygenRes.status).json({ error: data });
    }

    res.status(200).json(data.data);
  } catch (err) {
    console.error("Errore in /api/session:", err);
    res.status(500).json({ error: "Errore interno", detail: err.message });
  }
}


  } catch (error) {
    console.error("Errore in /api/session:", error);
    res.status(500).json({ error: "Errore nella creazione sessione", detail: error.message });
  }
}
