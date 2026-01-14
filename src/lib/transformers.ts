import { Artwork, Artist } from "@/lib/types";

export function transformArtworkFromAPI(apiArtwork: any): Artwork {
  return {
    id: apiArtwork._id,
    title: apiArtwork.title,
    artistId: apiArtwork.artist,
    artistName: apiArtwork.artist_name,
    year: apiArtwork.year_created,
    medium: apiArtwork.medium,
    dimensions: {
      width: apiArtwork.dimensions.width,
      height: apiArtwork.dimensions.height,
      unit: apiArtwork.dimensions.unit as "cm" | "in",
    },
    price: apiArtwork.price,
    currency: apiArtwork.currency,
    imageUrl:
      apiArtwork.images.find((img: any) => img.is_primary)?.url ||
      apiArtwork.images[0]?.url ||
      "",
    description: apiArtwork.description,
    available: apiArtwork.status === "available",
    featured: apiArtwork.featured || false,
  };
}

export function transformArtistFromAPI(apiArtist: any): Artist {
  return {
    id: apiArtist._id,
    name: `${apiArtist.first_name} ${apiArtist.last_name}`,
    nationality: apiArtist.nationality || "", // Add if API provides
    birthYear: apiArtist.birth_year || 0, // Add if API provides
    bio: apiArtist.bio,
    imageUrl: apiArtist.image_url || "", // Add if API provides
    featured: apiArtist.verified || apiArtist.featured || false,
  };
}
