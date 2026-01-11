"use client";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buildSrc, Video } from "@imagekit/next";
import { Clock, Play, Upload } from "lucide-react";

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

  // Adding helper function to Generate poster Url.

  const generatePosterUrl = (videoUrl: string) => {
    return buildSrc({
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
      src: `${videoUrl}/ik-thumbnail.jpg`,
      transformation: [
        {
          width: 500,
          height: 300,
          quality: 80,
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center justify-between">
              <div className="h-10 bg-slate-200 rounded-lg w-48"></div>
              <div className="h-10 bg-slate-200 rounded-lg w-40"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-4 space-y-3"
                >
                  <div className="h-48 bg-slate-200 rounded-lg"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Video Library
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              <Play className="w-4 h-4" />
              {allVideos.length} {allVideos.length === 1 ? "video" : "videos"}{" "}
              available
            </p>
          </div>
          <Button variant={"default"}>
            <Upload className="w-4 h-4" />
            <Link href={"/upload"}>Upload Video</Link>
          </Button>
        </div>

        {/* Empty State */}
        {allVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
              <Play className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              No videos yet
            </h2>
            <p className="text-slate-600 mb-6 text-center max-w-md">
              Get started by uploading your first video to build your library
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
              <Upload className="w-4 h-4" />
              Upload Your First Video
            </button>
          </div>
        ) : (
          /* Video Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideos.map((video) => (
              <div
                key={video.videoUrl}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300"
              >
                {/* Video Thumbnail/Player */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                  <Video
                    src={video.videoUrl}
                    controls={video.controls}
                    width={video.transformation?.width ?? 500}
                    height={video.transformation?.height ?? 300}
                    preload="none" // video won't download until user clicks play
                    poster={generatePosterUrl(video.videoUrl)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Video Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recently added</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
