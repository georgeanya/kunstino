import { Artwork, Artist, Story } from "@/lib/types";

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

// Story interfaces
interface StoryApiResponse {
  featured_image: {
    url: string;
    alt: string;
    caption: string;
    credits: string;
  };
  _id: string;
  title: string;
  slug: string;
  tags: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  author: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  content: string;
  excerpt: string;
  status: string;
  published_at: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface StoriesListApiResponse {
  data: StoryApiResponse[];
  total: number;
  page: number;
  limit: number;
}

interface SingleStoryApiResponse {
  story: StoryApiResponse;
  related: Array<{
    featured_image: {
      url: string;
      alt: string;
      caption: string;
      credits: string;
    };
    _id: string;
    title: string;
    slug: string;
    tags: Array<{
      _id: string;
      name: string;
      slug: string;
    }>;
    author: {
      _id: string;
      first_name: string;
      last_name: string;
    };
    excerpt: string;
    published_at: string;
  }>;
}

export async function getArtistBySlug(slug: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/artist/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artist: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch artist");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching artist:", error);
    throw error;
  }
}

export async function getArtworkBySlug(
  slug: string,
): Promise<ArtworkDetailResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/artwork/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch artwork by slug: ${response.statusText}`,
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
  artistId: string,
): Promise<ArtworkDetailResponse[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/artist/${artistId}/artworks`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch artist artworks: ${response.statusText}`,
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

// Get all stories with pagination
export async function getStories(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  stories: StoryApiResponse[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}> {
  try {
    const { page = 1, limit = 10 } = params || {};

    // Build query string with pagination
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/story?${queryParams}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    const data: ApiResponse<StoriesListApiResponse> = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch stories");
    }

    const storiesData = data.data;
    const totalPages = Math.ceil(storiesData.total / storiesData.limit);

    return {
      stories: storiesData.data || [],
      pagination: {
        totalPages: totalPages,
        currentPage: storiesData.page,
        totalItems: storiesData.total,
      },
    };
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
}

// Get single story by slug
export async function getStoryBySlug(slug: string): Promise<{
  story: StoryApiResponse;
  related: SingleStoryApiResponse["related"];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/story/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch story: ${response.statusText}`);
    }

    const data: ApiResponse<SingleStoryApiResponse> = await response.json();

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch story");
    }

    return {
      story: data.data.story,
      related: data.data.related || [],
    };
  } catch (error) {
    console.error("Error fetching story:", error);
    throw error;
  }
}

// Get featured stories
export async function getFeaturedStories(): Promise<StoryApiResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/story`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch featured stories: ${response.statusText}`,
      );
    }

    const data: ApiResponse<StoriesListApiResponse> = await response.json();

    return data.data.data || [];
  } catch (error) {
    console.error("Error fetching featured stories:", error);
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
    artistId: apiArtwork.artist || "",
    artistSlug: apiArtwork.artist_slug || "",
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

  return {
    id: apiArtist._id || "",
    name: `${apiArtist.first_name || ""} ${apiArtist.last_name || ""}`.trim(),
    nationality: nationality,
    birthYear: birthYear,
    bio: apiArtist.bio,
    imageUrl: imageUrl,
    featured: apiArtist.verified || apiArtist.featured || false,
    slug: apiArtist.slug || "",
  };
}

// Transform story from API response
export function transformStoryFromAPI(apiStory: any): Story {
  // Extract tag names for easier use
  const tags = apiStory.tags?.map((tag: any) => tag.name) || [];

  // Format author name
  const authorName = apiStory.author
    ? `${apiStory.author.first_name || ""} ${apiStory.author.last_name || ""}`.trim()
    : "";

  // Format published date
  let publishedDate = "";
  if (apiStory.published_at) {
    try {
      const date = new Date(apiStory.published_at);
      publishedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error parsing published date:", error);
    }
  }

  return {
    id: apiStory._id || "",
    title: apiStory.title || "",
    slug: apiStory.slug || "",
    excerpt: apiStory.excerpt || "",
    content: apiStory.content || "",
    featuredImage: {
      url: apiStory.featured_image?.url || "",
      alt: apiStory.featured_image?.alt || "",
      caption: apiStory.featured_image?.caption || "",
      credits: apiStory.featured_image?.credits || "",
    },
    author: {
      id: apiStory.author?._id || "",
      name: authorName,
    },
    tags: tags,
    publishedAt: apiStory.published_at || "",
    publishedDate: publishedDate,
    metaTitle: apiStory.meta_title || "",
    metaDescription: apiStory.meta_description || "",
    keywords: apiStory.keywords || [],
    status: apiStory.status || "draft",
  };
}

// Transform related story from API response (lightweight version)
export function transformRelatedStoryFromAPI(apiStory: any): Story {
  // Extract tag names for easier use
  const tags = apiStory.tags?.map((tag: any) => tag.name) || [];

  // Format author name
  const authorName = apiStory.author
    ? `${apiStory.author.first_name || ""} ${apiStory.author.last_name || ""}`.trim()
    : "";

  // Format published date
  let publishedDate = "";
  if (apiStory.published_at) {
    try {
      const date = new Date(apiStory.published_at);
      publishedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error parsing published date:", error);
    }
  }

  return {
    id: apiStory._id || "",
    title: apiStory.title || "",
    slug: apiStory.slug || "",
    excerpt: apiStory.excerpt || "",
    featuredImage: {
      url: apiStory.featured_image?.url || "",
      alt: apiStory.featured_image?.alt || "",
      caption: apiStory.featured_image?.caption || "",
      credits: apiStory.featured_image?.credits || "",
    },
    author: {
      id: apiStory.author?._id || "",
      name: authorName,
    },
    tags: tags,
    publishedAt: apiStory.published_at || "",
    publishedDate: publishedDate,
    // These fields might not be present in related stories response
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    status: "published",
  };
}
