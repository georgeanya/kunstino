import { Artist, Artwork } from "./types";

export const artists: Artist[] = [
  {
    id: "1",
    name: "Olumide Osamede",
    nationality: "Nigerian",
    birthYear: 1995,
    bio: "Olumide Osamede is a contemporary Nigerian artist known for his vibrant use of color and exploration of cultural identity. His work often features bold geometric patterns that reflect the intersection of traditional African art and modern abstraction. Born in Lagos, Osamede studied fine arts at the University of Lagos before gaining international recognition for his unique visual language.",
    imageUrl: "/images/artists/olumide-osamede.jpg",
    featured: true,
  },
  {
    id: "2",
    name: "Amara Chen",
    nationality: "Taiwanese",
    birthYear: 1988,
    bio: "Amara Chen creates contemplative landscapes that blur the boundaries between reality and imagination. Her ethereal oil paintings capture fleeting moments of natural beauty with masterful technique.",
    imageUrl: "/images/artists/amara-chen.jpg",
    featured: false,
  },
  {
    id: "3",
    name: "Marcus Weber",
    nationality: "German",
    birthYear: 1992,
    bio: "Marcus Weber is a mixed-media artist whose work explores the relationship between urban environments and human emotion. His layered compositions combine photography, painting, and digital elements.",
    imageUrl: "/images/artists/marcus-weber.jpg",
    featured: false,
  },
  {
    id: "4",
    name: "Sofia Ramirez",
    nationality: "Mexican",
    birthYear: 1990,
    bio: "Sofia Ramirez creates powerful portraits that celebrate the strength and resilience of women. Her bold use of color and texture brings her subjects to life with remarkable intensity.",
    imageUrl: "/images/artists/sofia-ramirez.jpg",
    featured: false,
  },
  {
    id: "5",
    name: "Yuki Tanaka",
    nationality: "Japanese",
    birthYear: 1985,
    bio: "Yuki Tanaka is known for minimalist compositions that explore the concept of negative space. Her work draws inspiration from Zen philosophy and traditional Japanese aesthetics.",
    imageUrl: "/images/artists/yuki-tanaka.jpg",
    featured: false,
  },
];

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Green Artwork",
    artistId: "1",
    artistName: "Olumide Osamede",
    year: 2020,
    medium: "Oil on canvas",
    dimensions: { width: 24, height: 24, unit: "in" },
    price: 1500,
    currency: "€",
    imageUrl: "/images/artworks/green-artwork.jpg",
    description:
      "A vibrant exploration of organic forms and natural color palettes.",
    available: true,
    featured: true,
  },
  {
    id: "2",
    title: "Superimposed Roots",
    artistId: "1",
    artistName: "Olumide Osamede",
    year: 2021,
    medium: "Mixed media on canvas",
    dimensions: { width: 36, height: 48, unit: "in" },
    price: 2800,
    currency: "€",
    imageUrl: "/images/artworks/superimposed-roots.jpg",
    description:
      "An intricate layering of cultural heritage and modern identity.",
    available: true,
    featured: true,
  },
  {
    id: "3",
    title: "Urban Meditation",
    artistId: "3",
    artistName: "Marcus Weber",
    year: 2022,
    medium: "Mixed media",
    dimensions: { width: 30, height: 40, unit: "in" },
    price: 2200,
    currency: "€",
    imageUrl: "/images/artworks/urban-meditation.jpg",
    description:
      "A contemplative piece capturing quiet moments in bustling city life.",
    available: true,
    featured: false,
  },
  {
    id: "4",
    title: "Essence of Strength",
    artistId: "4",
    artistName: "Sofia Ramirez",
    year: 2023,
    medium: "Acrylic on canvas",
    dimensions: { width: 32, height: 44, unit: "in" },
    price: 1900,
    currency: "€",
    imageUrl: "/images/artworks/essence-of-strength.jpg",
    description: "A powerful portrait celebrating feminine resilience.",
    available: true,
    featured: false,
  },
  {
    id: "5",
    title: "Tranquil Waters",
    artistId: "2",
    artistName: "Amara Chen",
    year: 2021,
    medium: "Oil on canvas",
    dimensions: { width: 28, height: 36, unit: "in" },
    price: 1700,
    currency: "€",
    imageUrl: "/images/artworks/tranquil-waters.jpg",
    description:
      "An ethereal landscape that captures the serene beauty of water.",
    available: true,
    featured: false,
  },
  {
    id: "6",
    title: "Void and Form",
    artistId: "5",
    artistName: "Yuki Tanaka",
    year: 2022,
    medium: "Ink on paper",
    dimensions: { width: 20, height: 26, unit: "in" },
    price: 1200,
    currency: "€",
    imageUrl: "/images/artworks/void-and-form.jpg",
    description: "A minimalist exploration of space and emptiness.",
    available: true,
    featured: false,
  },
  {
    id: "7",
    title: "Cultural Tapestry",
    artistId: "1",
    artistName: "Olumide Osamede",
    year: 2023,
    medium: "Oil on canvas",
    dimensions: { width: 40, height: 50, unit: "in" },
    price: 3200,
    currency: "€",
    imageUrl: "/images/artworks/cultural-tapestry.jpg",
    description:
      "A complex weaving of patterns representing diverse narratives.",
    available: true,
    featured: false,
  },
  {
    id: "8",
    title: "Sunset Reverie",
    artistId: "2",
    artistName: "Amara Chen",
    year: 2020,
    medium: "Oil on canvas",
    dimensions: { width: 34, height: 46, unit: "in" },
    price: 1850,
    currency: "€",
    imageUrl: "/images/artworks/sunset-reverie.jpg",
    description: "A dreamlike interpretation of twilight with glowing hues.",
    available: false,
    featured: false,
  },
];

// Utility functions
export const getArtistById = (id: string): Artist | undefined => {
  return artists.find((artist) => artist.id === id);
};

export const getArtworkById = (id: string): Artwork | undefined => {
  return artworks.find((artwork) => artwork.id === id);
};

export const getArtworksByArtist = (artistId: string): Artwork[] => {
  return artworks.filter((artwork) => artwork.artistId === artistId);
};

export const getFeaturedArtworks = (): Artwork[] => {
  return artworks.filter((artwork) => artwork.featured);
};

export const getFeaturedArtists = (): Artist[] => {
  return artists.filter((artist) => artist.featured);
};

export const paginateItems = <T>(
  items: T[],
  page: number,
  perPage: number = 16
): T[] => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
};

export const getTotalPages = (
  totalItems: number,
  perPage: number = 16
): number => {
  return Math.ceil(totalItems / perPage);
};
