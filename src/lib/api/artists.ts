const API_BASE_URL = "https://kunstino-backend-production.up.railway.app/v1";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface ArtistResponse {
  artists: Array<{
    _id: string;
    first_name: string;
    last_name: string;
    bio: string;
    social_links: {
      instagram?: string;
      website?: string;
      twitter?: string;
    };
    verified: boolean;
    featured?: boolean;
  }>;
}

export async function getArtists(): Promise<ArtistResponse["artists"]> {
  try {
    const response = await fetch(`${API_BASE_URL}/artist`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artists: ${response.statusText}`);
    }

    const data: ApiResponse<ArtistResponse> = await response.json();
    return data.data?.artists || [];
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
}

export async function getArtistById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/artist/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artist: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
}
