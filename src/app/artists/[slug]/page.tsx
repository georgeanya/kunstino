import { notFound } from 'next/navigation';
import { getArtistBySlug, getArtworksByArtist, transformArtworkFromAPI, transformArtistFromAPI } from '@/lib/api/artworks';
import ArtistDetailContent from '@/components/ArtistDetail';

const API_BASE_URL = "https://kunstino-backend-production.up.railway.app/v1";

export async function generateStaticParams() {
  const response = await fetch(`${API_BASE_URL}/artist`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    return [];
  }
  
  const data = await response.json();
  const artists = data.data?.artists || [];
  
  return artists.map((artist: any) => ({
    slug: artist.slug || artist._id,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const apiArtist = await getArtistBySlug(slug);
  
  if (!apiArtist) {
    notFound();
  }

  const artist = transformArtistFromAPI(apiArtist);
  const apiArtworks = await getArtworksByArtist(apiArtist._id);
  const artworks = apiArtworks.map(transformArtworkFromAPI);

  return <ArtistDetailContent artist={artist} artworks={artworks} apiArtist={apiArtist} />;
}