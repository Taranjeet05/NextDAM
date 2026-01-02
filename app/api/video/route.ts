import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // connect with DB
    await connectToDatabase();
    
    const allVideos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!allVideos || allVideos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(
      { message: "Fetched All Videos", allVideos },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch Videos", error);
    return NextResponse.json(
      { error: "Failed to fetch all Videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // checking User
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "You have to Login First" },
        { status: 401 }
      );
    }
    // connect to Db
    await connectToDatabase();

    const body: IVideo = await request.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailsUrl
    ) {
      return NextResponse.json(
        { message: "Missing required Fields" },
        { status: 400 }
      );
    }

    // Create Video
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body?.transformation?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);

    return NextResponse.json(
      { message: "Successfully uploaded", newVideo },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to create Video", error);
    return NextResponse.json(
      {
        error: "Failed to create Video",
      },
      { status: 500 }
    );
  }
}
