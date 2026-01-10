"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Upload, Video } from "lucide-react";
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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

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

      setUploadSuccess(true);

      // Auto-reset after showing success message
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setUploadedFileUrl("");
        setProgress(0);
        setFileName("");
        setUploadSuccess(false);
        setFileUploaded(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if all required fields are filled
  const isFormValid = title.trim() && description.trim() && fileUploaded;

  return (
    <div className="p-10 min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-mono font-extrabold tracking-tighter">
            Create Your Video
          </h2>
          <p className="text-muted-foreground mt-1">
            Upload and share your content with the world
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center mt-12">
        <Card className="w-full max-w-2xl p-8 shadow-lg">
          {uploadSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />
              <h3 className="text-2xl font-bold">Upload Successful!</h3>
              <p className="text-muted-foreground text-center">
                Your video has been uploaded and is now processing
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Video Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="title"
                  placeholder="Enter an engaging title for your video"
                  className="h-11"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  id="description"
                  placeholder="Describe your video content..."
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Upload File */}
              <div className="space-y-2">
                <FileUpload
                  fileType="video"
                  onProgress={(percent) => setProgress(percent)}
                  onSuccess={(res) => {
                    setUploadedFileUrl(res.url);
                    setFileName(res.name);
                    setFileUploaded(true);
                  }}
                  onFileRemove={() => {
                    setUploadedFileUrl("");
                    setFileName("");
                    setFileUploaded(false);
                    setProgress(0);
                  }}
                />

                {/* File Upload Status - Only show after successful upload */}
                {fileUploaded && fileName && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                    <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium truncate flex-1 text-green-900 dark:text-green-100">
                      {fileName}
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  </div>
                )}
              </div>

              {/* Progress Bar - Only show during upload */}
              {progress > 0 && progress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Submit Button - Only enabled when all fields are filled */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setTitle("");
                    setDescription("");
                    setUploadedFileUrl("");
                    setProgress(0);
                    setFileName("");
                    setFileUploaded(false);
                  }}
                  disabled={loading}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  className="font-semibold min-w-[140px]"
                  disabled={!isFormValid || loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-pulse">Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Publish Video
                    </>
                  )}
                </Button>
              </div>

              {/* Helper text when form is incomplete */}
              {!isFormValid && (
                <p className="text-xs text-muted-foreground text-center">
                  Please fill in all required fields to publish your video
                </p>
              )}
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UploadPage;
