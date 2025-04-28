import { NextResponse } from "next/server"
import Replicate from "replicate"

// Инициализация Replicate клиента
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Генерация изображения с помощью Stable Diffusion
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: `background for product card, ${prompt}, high quality, 8k, no text, no watermark`,
          negative_prompt: "text, watermark, logo, signature, low quality, blurry",
          width: 900,
          height: 900,
          scheduler: "K_EULER",
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
