'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArtworkById, getArtworksByArtist } from '@/lib/data';
import ArtworkCard from '@/components/ArtworkCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ArtworkDetailPage({ params }: PageProps) {
  const { t } = useLanguage();
  const artwork = getArtworkById(params.id);

  if (!artwork) {
    notFound();
  }

  const otherArtworks = getArtworksByArtist(artwork.artistId)
    .filter((a) => a.id !== artwork.id)
    .slice(0, 4);

  return (
    <main className="px-4 py-8 lg:px-[100px] lg:py-12">
      <div className="mb-6">
        <h1 className="text-xl lg:text-3xl font-medium">
          {t.artworks} <span className="text-gray-400">/ {artwork.title}</span>
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12 mb-12 lg:mb-16">
        {/* Image Gallery */}
        <div className="mb-6 lg:mb-0">
          <div className="relative aspect-[3/4] bg-gray-100">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <Link
            href={`/artists/${artwork.artistId}`}
            className="text-sm lg:text-lg font-medium hover:underline block mb-2"
          >
            {artwork.artistName}
          </Link>
          <h2 className="text-lg lg:text-2xl font-medium mb-1">
            {artwork.title}, {artwork.year}
          </h2>
          <p className="text-xs lg:text-base text-gray-600 mb-1">{artwork.medium}</p>
          <p className="text-xs lg:text-base text-gray-600 mb-4 lg:mb-6">
            {artwork.dimensions.width} X {artwork.dimensions.height}{' '}
            {artwork.dimensions.unit}
          </p>

          <p className="text-xl lg:text-3xl font-medium mb-4 lg:mb-6">
            {artwork.currency}{artwork.price.toLocaleString()}
          </p>

          <p className="text-xs lg:text-sm text-gray-600 mb-4 lg:mb-6">
            {t.taxesShipping}
          </p>

          <Link
            href="/checkout"
            className="block w-full bg-black text-white text-center py-3 lg:py-4 rounded-lg hover:bg-gray-800 transition-colors mb-6 lg:mb-8 font-medium text-sm"
          >
            {t.purchase}
          </Link>

          <div>
            <h3 className="font-medium mb-3 text-sm lg:text-base">{t.artistNote}</h3>
            <p className="text-xs lg:text-sm text-gray-700 leading-relaxed">
              {artwork.description}
            </p>
          </div>
        </div>
      </div>

      {/* Other artworks by artist */}
      {otherArtworks.length > 0 && (
        <section>
          <h2 className="text-lg lg:text-2xl font-medium mb-6 lg:mb-8">
            {t.otherArtworksByArtist(artwork.artistName)}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {otherArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}