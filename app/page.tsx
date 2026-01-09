"use client";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Video } from "@imagekit/next";

const Home = () => {
  const [allVideos, setAllVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await apiClient.getVideos();
        setAllVideos(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold hover:italic hover:transition-all hover:duration-200 hover:ease-in-out hover:text-blue-900 ">
          All Videos
        </h1>
        <Button>
          <Link href={"/upload"}>Upload New Video</Link>
        </Button>
      </div>

      {/* All videos */}
      <div className="grid grid-cols-3 gap-4">
        {allVideos.length > 0 &&
          allVideos.map((video) => (
            <div key={video._id?.toString()} className="border p-4">
              <h2>{video.title}</h2>
              <p>{video.description}</p>
              <Video
                urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT!}
                src={video.videoUrl}
                controls={video.controls}
                width={video.transformation?.width ?? 500}
                height={video.transformation?.height ?? 300}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
