export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST consentito" });
  }

  try {
    const { message, session_id } = req.body;

    if (!message || !session_id) {
      return res.status(400).json({ error: "Messaggio o session_id mancante" });
    }

    // 1. Richiesta a OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sei Alfred, un assistente rassicurante, ~67 anni." },
          { role: "user", content: message }
        ]
      })
    });

    const openaiData = await openaiRes.json();
    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: openaiData });
    }

    const reply = openaiData.choices[0].message.content;

    // 2. Invio testo a HeyGen per farlo parlare
    const heyRes = await fetch("https://api.heygen.com/v1/streaming.avatar.speak", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HEYGEN_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_id,
        text: reply
      })
    });

    const heyData = await heyRes.json();
    if (!heyRes.ok) {
      return res.status(heyRes.status).json({ error: heyData });
    }

    res.status(200).json({ answer: reply });
  } catch (err) {
    console.error("Errore in /api/ask:", err);
    res.status(500).json({ error: "Errore interno", detail: err.message });
  }
}
