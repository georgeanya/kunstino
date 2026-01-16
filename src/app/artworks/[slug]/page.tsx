import { notFound } from 'next/navigation';
import { getArtworkBySlug, getArtistBySlug, getArtworksByArtist, transformArtworkFromAPI } from '@/lib/api/artworks';
import ArtworkDetailContent from '@/components/ArtworkDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    // Fetch artwork details by slug
    const apiArtwork = await getArtworkBySlug(slug);
    const artwork = transformArtworkFromAPI(apiArtwork);
    
    let artistSlug = '';
    try {
      // Try to get artist slug
      const artistResponse = await getArtistBySlug(artwork.artistId);
      artistSlug = artistResponse?.slug || '';
    } catch (error) {
      console.warn('Could not fetch artist slug:', error);
    }

    // Fetch other artworks by the same artist
    const apiOtherArtworks = await getArtworksByArtist(artwork.artistId);
    const otherArtworks = apiOtherArtworks
      .map(transformArtworkFromAPI)
      .filter((a) => a.id !== artwork.id)
      .slice(0, 4);

    return (
      <ArtworkDetailContent 
        artwork={artwork}
        artistSlug={artistSlug}
        otherArtworks={otherArtworks}
      />
    );
    
  } catch (error) {
    console.error('Error fetching artwork:', error);
    notFound();
  }
}