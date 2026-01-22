export interface Artist {
  id: string;
  name: string;
  nationality: string;
  birthYear: number;
  bio: string;
  imageUrl: string;
  featured: boolean;
  slug: string;
}

export interface Artwork {
  id: string;
  title: string;
  artistId?: any;
  artistName: string;
  artistSlug: string;
  year: number;
  medium: string;
  dimensions: {
    width: number;
    height: number;
    unit: "in" | "cm" | "px" | "degree";
  };
  price: number;
  currency: string;
  imageUrl: string;
  description: string;
  available: boolean;
  featured: boolean;
  slug: string;
}

export interface Story {
  featuredImage: {
    url: string;
    alt: string;
    caption: string;
    credits: string;
  };
  id: string;
  title: string;
  slug: string;
  tags: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  author: {
    id: string;
    name: string;
  };
  content: string;
  excerpt: string;
  status: string;
  publishedAt: string;
  publishedDate: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  street: string;
  additionalStreet?: string;
  city: string;
  zipCode: string;
  state: string;
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
