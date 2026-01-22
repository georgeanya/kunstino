const API_BASE_URL = "https://kunstino-backend-production.up.railway.app/v1";

export interface ArtworkData {
  id: string;
  title: string;
  description: string;
  artistName: string;
  artistId: string;
  artistSlug?: string;
  medium: string;
  style?: string[];
  subject?: string[];
  category?: string;
  imageUrl: string;
  slug: string;
  year?: number;
  price?: number;
  currency?: string;
  available: boolean;
}

// Fetch ALL artworks for client-side search
export async function fetchAllArtworks(): Promise<ArtworkData[]> {
  try {
    console.log("Fetching artworks for search...");

    // Fetch with a high limit to get all artworks at once
    const response = await fetch(`${API_BASE_URL}/artwork?page=1&limit=500`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artworks: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API response status:", data.status);
    console.log("Number of artworks:", data.data?.artworks?.length || 0);

    if (data.status !== "Success") {
      throw new Error(data.message || "Failed to fetch artworks");
    }

    if (!data.data?.artworks) {
      console.warn("No artworks found in response");
      return [];
    }

    // Transform API response
    const artworks = data.data.artworks.map((artwork: any) => {
      const imageUrl =
        artwork.images?.find((img: any) => img.is_primary)?.url ||
        artwork.images?.[0]?.url ||
        "";

      return {
        id: artwork._id || "",
        title: artwork.title || "",
        description: artwork.description || "",
        artistName: artwork.artist_name || "",
        artistId: artwork.artist || "",
        artistSlug: artwork.artist_slug || "",
        medium: artwork.medium || "",
        style: artwork.style || [],
        subject: artwork.subject || [],
        category: artwork.category || "",
        imageUrl: imageUrl,
        slug: artwork.slug || "",
        year: artwork.year_created,
        price: artwork.price,
        currency: artwork.currency,
        available: artwork.status === "available",
      };
    });

    console.log(`Successfully fetched ${artworks.length} artworks for search`);
    return artworks;
  } catch (error) {
    console.error("Error fetching artworks for search:", error);
    return [];
  }
}

// Perform search on client-side
export function searchArtworksClientSide(
  artworks: ArtworkData[],
  query: string,
): ArtworkData[] {
  if (!query.trim() || artworks.length === 0) {
    return [];
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  if (searchTerms.length === 0) {
    return [];
  }

  // Filter artworks based on search terms
  return artworks.filter((artwork) => {
    const searchText = [
      artwork.title,
      artwork.artistName,
      artwork.medium,
      artwork.description,
      ...(artwork.style || []),
      ...(artwork.subject || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    // Check if any search term matches
    return searchTerms.some(
      (term) => term.length > 1 && searchText.includes(term),
    );
  });
}

// Transform search data to your Artwork type
export function transformToArtworkType(artworkData: ArtworkData): any {
  return {
    id: artworkData.id,
    title: artworkData.title,
    artistId: artworkData.artistId,
    artistSlug: artworkData.artistSlug,
    artistName: artworkData.artistName,
    year: artworkData.year || 0,
    medium: artworkData.medium,
    dimensions: {
      width: 0,
      height: 0,
      unit: "cm" as const,
    },
    price: artworkData.price || 0,
    currency: artworkData.currency || "USD",
    imageUrl: artworkData.imageUrl,
    description: artworkData.description,
    available: artworkData.available,
    featured: false,
    slug: artworkData.slug,
  };
}
