import config from '../config/env';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
}

export interface YouTubeSearchResponse {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
      channelTitle: string;
      publishedAt: string;
    };
  }[];
}

class YouTubeService {
  private apiKey = config.YOUTUBE_API_KEY;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  async searchVideos(query: string, maxResults: number = 1): Promise<YouTubeVideo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&type=video&q=${encodeURIComponent(
          query
        )}&maxResults=${maxResults}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data: YouTubeSearchResponse = await response.json();

      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  }

  async getVideoById(videoId: string): Promise<YouTubeVideo | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/videos?part=snippet&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching YouTube video:', error);
      throw error;
    }
  }
}

export const youtubeService = new YouTubeService();
