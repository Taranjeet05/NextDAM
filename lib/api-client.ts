import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

type GetVideosResponse = {
  data: IVideo[];
};

class ApiClient {
  private async fetch<T>(
    endPoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(endPoint, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getVideos(): Promise<IVideo[]> {
    return this.fetch<IVideo[]>("/api/video");
  }

  async createVideos(videoData: VideoFormData) {
    return this.fetch("/api/video", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
