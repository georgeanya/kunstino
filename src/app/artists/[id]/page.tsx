'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArtistById, getArtworksByArtist } from '@/lib/data';
import ArtworkCard from '@/components/ArtworkCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ArtistDetailPage({ params }: PageProps) {
  const { t } = useLanguage();
  const artist = getArtistById(params.id);

  if (!artist) {
    notFound();
  }

  const artworks = getArtworksByArtist(artist.id);

  return (
    <main className="px-4 py-8 lg:px-[100px] lg:py-12">
      <div className="mb-6">
        <h1 className="text-xl lg:text-3xl font-medium">
          {t.artists} <span className="text-gray-400">/ {artist.name}</span>
        </h1>
      </div>

      <div className="mb-12 lg:mb-16">
        {/* Artist Image */}
        <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] bg-gray-100 mb-6">
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Artist Info */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-medium mb-2">{artist.name}</h2>
          <p className="text-sm lg:text-lg text-gray-600 mb-6 lg:mb-8">
            {artist.nationality}, {t.born} {artist.birthYear}
          </p>

          <div className="prose max-w-none">
            <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
              {artist.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Artist's Artworks */}
      <section>
        <h2 className="text-lg lg:text-2xl font-medium mb-6 lg:mb-8">
          {t.artworksByArtist(artist.name)}
        </h2>
        {artworks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{t.noArtworks}</p>
        )}
      </section>
    </main>
  );
}