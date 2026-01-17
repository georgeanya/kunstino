import { Artwork, Artist } from "@/lib/types";

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
    artist: string; // This should be artist ID
    artist_name: string;
    artist_slug?: string; // Optional: Add artist slug if API provides it
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
    slug: string;
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
  profile_image?: string;
  slug: string;
  dob?: string;
}

// Interface for single artwork response
interface ArtworkDetailResponse {
  _id: string;
  title: string;
  description: string;
  artist: string; // This is artist ID
  artist_name: string;
  artist_slug?: string; // Optional: Add if API provides it
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

// Update getArtistBySlug to match your API response
export async function getArtistBySlug(slug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/artist/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artist: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch artist");
    }

    return data.data; // Return the artist data from API response
  } catch (error) {
    console.error("Error fetching artist:", error);
    throw error;
  }
}

export async function getArtworkBySlug(
  slug: string
): Promise<ArtworkDetailResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/artwork/${slug}`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch artwork by slug: ${response.statusText}`
      );
    }

    const data: ApiResponse<ArtworkDetailResponse> = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch artwork by slug");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching artwork by slug:", error);
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

export function transformArtworkFromAPI(apiArtwork: any): Artwork {
  // Get the primary image URL or fall back to the first image
  const imageUrl =
    apiArtwork.images?.find((img: any) => img.is_primary)?.url ||
    apiArtwork.images?.[0]?.url ||
    "";

  return {
    id: apiArtwork._id || "",
    title: apiArtwork.title || "",
    artistId: apiArtwork.artist || "", // Keep this as artist ID (for API calls)
    artistSlug: apiArtwork.artist_slug || "", // Add separate field for artist slug
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
    imageUrl: imageUrl,
    description: apiArtwork.description || "",
    available: apiArtwork.status === "available",
    featured: apiArtwork.featured || false,
    slug: apiArtwork.slug || "",
  };
}

export function transformArtistFromAPI(apiArtist: any): Artist {
  // Get the profile image URL from profile_image field
  const imageUrl = apiArtist.profile_image || apiArtist.image_url || "";

  // Extract birth year from dob field (format: "1990-05-15T00:00:00.000Z")
  let birthYear = apiArtist.birth_year || 0;

  if (!birthYear && apiArtist.dob) {
    try {
      const dobDate = new Date(apiArtist.dob);
      if (!isNaN(dobDate.getTime())) {
        birthYear = dobDate.getFullYear();
      }
    } catch (error) {
      console.error("Error parsing date of birth:", error);
    }
  }

  // Extract nationality from the API response
  const nationality = apiArtist.nationality;

  // Process bio for markdown - example with basic formatting
  const bioMarkdown = apiArtist.bio
    ? apiArtist.bio
        .replace(/\n\n/g, "\n\n") // Keep double line breaks
        .replace(/\*\*(.*?)\*\*/g, "**$1**") // Preserve bold
        .replace(/\*(.*?)\*/g, "*$1*") // Preserve italics
        .replace(/\[(.*?)\]\((.*?)\)/g, "[$1]($2)") // Preserve links
    : "";
  return {
    id: apiArtist._id || "",
    name: `${apiArtist.first_name || ""} ${apiArtist.last_name || ""}`.trim(),
    nationality: nationality,
    birthYear: birthYear,
    bio: bioMarkdown || "",
    imageUrl: imageUrl,
    featured: apiArtist.verified || apiArtist.featured || false,
    slug: apiArtist.slug || "",
  };
}
