import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getArtistById, getArtworksByArtist, artists } from '@/lib/data';
import ArtworkCard from '@/components/ArtworkCard';

// This function generates the static paths for all artist pages
export async function generateStaticParams() {
  return artists.map((artist) => ({
    id: artist.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { id } = await params;
  const artist = getArtistById(id);

  if (!artist) {
    notFound();
  }

  const artworks = getArtworksByArtist(artist.id);

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
          Artist <span className="text-[16px] font-sans">/ {artist.name}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      <div className="lg:flex lg:gap-12 mb-12 lg:mb-20">
        {/* Artist Image */}
        <div className="relative aspect-3/4 lg:aspect-auto lg:h-150 bg-gray-100 mb-6">
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
          <p className="text-[20px] mb-6 text-black">
            {artist.nationality}, b. {artist.birthYear}
          </p>
          <p className="text-sm leading-4.75 text-black">
              {artist.bio}
            </p>
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