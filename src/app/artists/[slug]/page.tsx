import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArtistBySlug, getArtworksByArtist, transformArtworkFromAPI, transformArtistFromAPI } from '@/lib/api/artworks';
import ArtworkCard from '@/components/ArtworkCard';

const API_BASE_URL = "https://kunstino-backend-production.up.railway.app/v1";
export async function generateStaticParams() {
  // Fetch all artists from API to get their slugs
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
  
  // Fetch artist data by slug
  const apiArtist = await getArtistBySlug(slug);
  
  if (!apiArtist) {
    notFound();
  }

  // Transform API data to match your component's expected format
  const artist = transformArtistFromAPI(apiArtist);

  // Fetch artist's artworks using artist ID from API
  const apiArtworks = await getArtworksByArtist(apiArtist._id);
  const artworks = apiArtworks.map(transformArtworkFromAPI);

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
          Artist <span className="text-[16px] font-sans">/ {artist.name}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      
      <div className="lg:flex lg:gap-12 mb-12 lg:mb-20">
        {/* Artist Image */}
        <div className="relative aspect-square mb-6">
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            width={500}
            height={500}
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Artist Info */}
        <div>
          <h2 className="text-[28px] font-medium mb-1">{artist.name}</h2>
          
      
          {artist.nationality && (
            <p className="text-[20px] mb-6 text-black">
              {artist.nationality}
              {artist.birthYear && `, b. ${artist.birthYear}`}
            </p>
          )}
          
          {/* Bio */}
          {artist.bio && (
            <p className="text-sm leading-4.75 text-black mb-6">
              {artist.bio}
            </p>
          )}
          
          {/* Social Links (optional) */}
          {apiArtist.social_links && (
            <div className="mt-4">
              {apiArtist.social_links.instagram && (
                <a 
                  href={`https://instagram.com/${apiArtist.social_links.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mr-4 text-sm text-blue-600 hover:underline"
                >
                  Instagram
                </a>
              )}
              {apiArtist.social_links.website && (
                <a 
                  href={apiArtist.social_links.website.startsWith('http') ? apiArtist.social_links.website : `https://${apiArtist.social_links.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-600 hover:underline"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Artist's Artworks */}
      <section>
        <h2 className="text-[22px]">
          Artworks by {artist.name}
        </h2>
        <hr className='my-5 opacity-20'/>
        {artworks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16.75">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-black">No artworks available at the moment.</p>
        )}
      </section>
    </main>
  );
}