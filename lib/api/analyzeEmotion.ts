import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type ResponseData = {
  mood?: string;
  message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userMessage }: { userMessage: string } = req.body;
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

  if (!apiKey) {
    return res.status(500).json({ message: "API Key is missing" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `Analyze the mood of this text and return one word like Happy, Sad, Angry, or Neutral: "${userMessage}"` }],
          },
        ],
      }
    );

    const mood = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Neutral";

    res.status(200).json({ mood });
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
