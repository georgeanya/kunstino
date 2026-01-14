const API_BASE_URL = "https://kunstino-backend-production.up.railway.app/v1";

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface ArtworkResponse {
  artworks: Array<{
    _id: string;
    title: string;
    description: string;
    artist: string;
    artist_name: string;
    price: number;
    currency: string;
    year_created: number;
    images: Array<{
      url: string;
      is_primary: boolean;
      _id: string;
    }>;
    dimensions: {
      width: number;
      height: number;
      unit: string;
    };
    medium: string;
    status: string;
    featured?: boolean;
  }>;
  total_pages: number;
  current_page: number;
  total?: number;
}

interface ArtistApiResponse {
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
  nationality?: string;
  birth_year?: number;
  image_url?: string;
}

// Interface for single artwork response
interface ArtworkDetailResponse {
  _id: string;
  title: string;
  description: string;
  artist: string;
  artist_name: string;
  price: number;
  currency: string;
  category: string;
  medium: string;
  style: string[];
  subject: string[];
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  year_created: number;
  images: Array<{
    url: string;
    is_primary: boolean;
    _id: string;
  }>;
  status: string;
  is_unique: boolean;
  has_certificate: boolean;
  tags: string[];
  slug: string;
  available_quantity: number;
}

// Interface for artist's artworks response
interface ArtistArtworksResponse {
  artistArtworks: Array<ArtworkDetailResponse>;
  total_pages: number;
  current_page: number;
}

// Get single artwork by ID
export async function getArtworkById(
  id: string
): Promise<ArtworkDetailResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/artwork/${id}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artwork: ${response.statusText}`);
    }

    const data: ApiResponse<ArtworkDetailResponse> = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch artwork");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching artwork:", error);
    throw error;
  }
}

// New function: Get artworks by artist
export async function getArtworksByArtist(
  artistId: string
): Promise<ArtworkDetailResponse[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/artist/${artistId}/artworks`,
      {
        cache: "force-cache",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch artist artworks: ${response.statusText}`
      );
    }

    const data: ApiResponse<ArtistArtworksResponse> = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch artist artworks");
    }

    return data.data?.artistArtworks || [];
  } catch (error) {
    console.error("Error fetching artist artworks:", error);
    throw error;
  }
}

// Update getArtworks to accept pagination parameters
export async function getArtworks(params?: {
  page?: number;
  limit?: number;
  featured?: boolean;
}): Promise<{
  artworks: ArtworkResponse["artworks"];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}> {
  try {
    const { page = 1, limit = 16, featured } = params || {};

    // Build query string with pagination
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add featured filter if provided
    if (featured !== undefined) {
      queryParams.append("featured", featured.toString());
    }

    const response = await fetch(`${API_BASE_URL}/artwork?${queryParams}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artworks: ${response.statusText}`);
    }

    const data: ApiResponse<ArtworkResponse> = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch artworks");
    }

    return {
      artworks: data.data?.artworks || [],
      pagination: {
        totalPages: data.data?.total_pages || 1,
        currentPage: data.data?.current_page || 1,
        totalItems: data.data?.total || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw error;
  }
}

// Get all artists
export async function getArtists(): Promise<ArtistApiResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/artist`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artists: ${response.statusText}`);
    }

    const data: ApiResponse<{ artists: ArtistApiResponse[] }> =
      await response.json();
    return data.data?.artists || [];
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw error;
  }
}

// Get single artist by ID
export async function getArtistById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/artist/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artist: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching artist:", error);
    throw error;
  }
}

import { Artwork, Artist } from "@/lib/types";

export function transformArtworkFromAPI(apiArtwork: any): Artwork {
  return {
    id: apiArtwork._id || "",
    title: apiArtwork.title || "",
    artistId: apiArtwork.artist || "",
    artistName: apiArtwork.artist_name || "",
    year: apiArtwork.year_created || 0,
    medium: apiArtwork.medium || "",
    dimensions: {
      width: apiArtwork.dimensions?.width || 0,
      height: apiArtwork.dimensions?.height || 0,
      unit: (apiArtwork.dimensions?.unit as "cm" | "in") || "cm",
    },
    price: apiArtwork.price || 0,
    currency: apiArtwork.currency || "USD",
    imageUrl:
      apiArtwork.images?.find((img: any) => img.is_primary)?.url ||
      apiArtwork.images?.[0]?.url ||
      "",
    description: apiArtwork.description || "",
    available: apiArtwork.status === "available",
    featured: apiArtwork.featured || false,
  };
}

export function transformArtistFromAPI(apiArtist: any): Artist {
  return {
    id: apiArtist._id || "",
    name: `${apiArtist.first_name || ""} ${apiArtist.last_name || ""}`.trim(),
    nationality: apiArtist.nationality || "",
    birthYear: apiArtist.birth_year || 0,
    bio: apiArtist.bio || "",
    imageUrl: apiArtist.image_url || "",
    featured: apiArtist.verified || apiArtist.featured || false,
  };
}
