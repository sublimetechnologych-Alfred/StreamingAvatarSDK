// api/session.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name } = await req.json();

    // Chiave segreta HeyGen (mettila in Vercel → Settings → Environment Variables)
    const apiKey = process.env.HEYGEN_API_KEY;

    const response = await fetch("https://api.heygen.com/v1/streaming.new", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice: {
          voice_id: "5c1ade5e514c4c6c900b0ded224970fd", // Theo - Friendly
        },
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
