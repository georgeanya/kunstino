export interface Artist {
  id: string;
  name: string;
  nationality: string;
  birthYear: number;
  bio: string;
  imageUrl: string;
  featured: boolean;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  year: number;
  medium: string;
  dimensions: {
    width: number;
    height: number;
    unit: "in" | "cm";
  };
  price: number;
  currency: string;
  imageUrl: string;
  description: string;
  available: boolean;
  featured: boolean;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
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
