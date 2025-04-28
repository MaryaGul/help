import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Upload the image to Cloudinary with background removal
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        imageUrl,
        {
          background_removal: "cloudinary_ai",
          notification_url: "https://mysite.example.com/notify_endpoint",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
    })

    // @ts-ignore - Cloudinary types are not properly defined
    return NextResponse.json({ url: uploadResult.secure_url })
  } catch (error) {
    console.error("Error removing background:", error)
    return NextResponse.json({ error: "Failed to remove background" }, { status: 500 })
  }
}
