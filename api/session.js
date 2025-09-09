export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.heygen.com/v1/streaming.new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HEYGEN_API_KEY}`
      },
      body: JSON.stringify({
        avatar_id: "1837f93f22f94b88b9992853ca5e84f8", // Alfred
        voice_id: "5c1ade5e514c4c6c900b0ded224970fd"  // Theo - Friendly
      })
    });

    const data = await response.json();
    console.log("HeyGen response:", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Errore API HeyGen:", error);
    res.status(500).json({ error: "Errore server HeyGen" });
  }
}
