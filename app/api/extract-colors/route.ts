import { NextResponse } from "next/server"
import * as Vibrant from "node-vibrant"

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Extract colors from the image
    const palette = await Vibrant.from(imageUrl).getPalette()

    // Convert palette to array of hex colors
    const colors = Object.values(palette)
      .filter((swatch) => swatch !== null)
      .map((swatch) => swatch!.getHex())

    return NextResponse.json({ colors })
  } catch (error) {
    console.error("Error extracting colors:", error)
    return NextResponse.json({ error: "Failed to extract colors" }, { status: 500 })
  }
}
