"use client"; // This component must be a client component

import { upload } from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess: (res: { fileId: string; url: string; name: string }) => void;
  onProgress: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Optional Validation
  function validateFile(file: File) {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please Upload a valid video file");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      return setError("File size must be less than 100 MB");
    }
    return true;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (validateFile(file) !== true) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const response = await upload({
        // Authentication parameters
        file,
        fileName: file.name,
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
        name: response.name || file.name,
      });
    } catch (error) {
      console.error("Failed to upload file", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* File input element using React ref */}
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <span>Loading ...</span>}
      {error && <span style={{ color: "red" }}>{error}</span>}

      <br />
    </>
  );
};

export default FileUpload;
