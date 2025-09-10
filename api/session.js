export default async function handler(req, res) {
  console.log("HEYGEN_API_KEY:", process.env.HEYGEN_API_KEY ? "OK" : "MISSING");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non permesso" });
  }

  try {
    const response = await fetch("https://api.heygen.com/v1/streaming.new", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HEYGEN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice: { voice_id: "5c1ade5e514c4c6c900b0ded224970fd" },
      }),
    });

    const data = await response.json();
    console.log("HeyGen response:", data);

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Errore session.js:", err);
    return res.status(500).json({
      error: "Errore nella creazione sessione",
      detail: err.message,
    });
  }
}
