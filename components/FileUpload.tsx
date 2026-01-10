"use client";

import { upload } from "@imagekit/next";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: { fileId: string; url: string; name: string }) => void;
  onProgress: (progress: number) => void;
  onFileRemove: () => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, onFileRemove, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File) {
    setError(null);

    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
      return false;
    }
    return true;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/imagekit-auth");
      const auth = await authRes.json();

      const response = await upload({
        file: selectedFile,
        fileName: selectedFile.name,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,

        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      onSuccess({
        fileId: response.fileId || "",
        url: response.url || "",
        name: response.name || selectedFile.name,
      });

      setUploadComplete(true);
    } catch (error) {
      console.error("Failed to upload file", error);
      setError("Upload failed. Please try again.");
      onProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    setUploadComplete(false);
    onFileRemove();
    onProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="upload" className="text-base font-medium">
        Upload Video <span className="text-destructive">*</span>
      </Label>

      <div className="space-y-3">
        {/* File Input - Hide after upload is complete */}
        {!uploadComplete && (
          <div className="flex items-center gap-3">
            <Input
              ref={fileInputRef}
              id="upload"
              type="file"
              accept={fileType === "video" ? "video/*" : "image/*"}
              onChange={handleFileChange}
              className="flex-1"
              disabled={uploading}
            />
            
            {selectedFile && !uploading && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Selected File Info with Start Upload Button */}
        {selectedFile && !uploading && !uploadComplete && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-md border-2 border-dashed">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            
            <Button
              type="button"
              onClick={handleUpload}
              size="sm"
              className="ml-3 flex-shrink-0"
            >
              <Upload className="w-4 h-4 mr-2" />
              Start Upload
            </Button>
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <p className="text-sm text-primary font-medium animate-pulse">
            Uploading your video...
          </p>
        )}

        {/* Upload Complete - Show option to change file */}
        {uploadComplete && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              Video uploaded successfully!
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearFile}
            >
              Change Video
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Helper Text */}
        {!uploadComplete && (
          <p className="text-xs text-muted-foreground">
            Supported formats: MP4, MOV, AVI, WebM • Max size: 100 MB
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;