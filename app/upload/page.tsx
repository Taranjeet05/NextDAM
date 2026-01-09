"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { apiClient } from "@/lib/api-client";

const UploadPage = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileUrl) return alert("Please Upload a Video First!");
    if (!title.trim() || !description.trim())
      return alert("Please enter title and description");
    try {
      setLoading(true);

      const videoData = {
        title,
        description,
        videoUrl: uploadedFileUrl,
        thumbnailsUrl: uploadedFileUrl,
        controls: true,
        transformation: {
          height: 1920,
          width: 1080,
          quality: 100,
        },
      };

      await apiClient.createVideos(videoData);

      alert("Video Uploaded Successfully");

      // Reset Form
      setTitle("");
      setDescription("");
      setUploadedFileUrl("");
      setProgress(0);
    } catch (error) {
      console.error(error);
      alert("Failed to Upload Video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-mono font-extrabold tracking-tighter">
          Create Your Video
        </h2>
        <Button variant={"ghost"}>
          <Link
            href={"/"}
            className="flex items-center justify-center gap-4 text-lg font-bold py-4 px-6"
          >
            <ArrowLeft className="w-8 h-8" /> Go to Home
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center mt-20">
        <Card className="w-full max-w-2xl p-7">
          {/* Form */}
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="cursor-pointer">
                Title*
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                placeholder="Please Enter Video Title"
              />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="cursor-pointer">
                Description*
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                placeholder="Please Enter Video Description..."
              />
            </div>
            {/* Upload File */}
            <div className="space-y-2">
              <FileUpload
                fileType="video"
                onProgress={(percent) => setProgress(percent)}
                onSuccess={(res) => setUploadedFileUrl(res.url)}
              />
            </div>
            {/* Progress Bar */}
            {progress > 0 && (
              <div className="flex items-center justify-center mt-4">
                <Progress value={progress} className="w-[60%]" />
              </div>
            )}

            <div className="flex items-center justify-end">
              <Button type="submit" className="font-bold">
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
