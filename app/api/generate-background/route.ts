import { NextResponse } from "next/server"
import Replicate from "replicate"

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Generate image using Stable Diffusion
    const output = await replicate.run(
      "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
      {
        input: {
          prompt: `background for product card, ${prompt}, high quality, 8k, no text, no watermark`,
          negative_prompt: "text, watermark, logo, signature, low quality, blurry",
          width: 900,
          height: 900,
          num_outputs: 1,
        },
      },
    )

    // @ts-ignore - Replicate types are not properly defined
    const imageUrl = output[0]

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("Error generating background:", error)
    return NextResponse.json({ error: "Failed to generate background" }, { status: 500 })
  }
}
