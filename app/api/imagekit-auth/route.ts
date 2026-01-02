import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY; // Never expose this on client side
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      throw new Error("ImageKit environment variables are missing");
    }
    const authenticationParameters = getUploadAuthParams({
      privateKey, // Never expose this on client side
      publicKey,
    });
    // authenticationParameters hold these things { token, expire, signature } ✨

    return NextResponse.json(
      {
        authenticationParameters,
        publicKey,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      {
        error: "Authentication for Image-Kit Failed",
      },
      { status: 500 }
    );
  }
}
