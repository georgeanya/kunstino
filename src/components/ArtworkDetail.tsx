'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import ArtworkCard from '@/components/ArtworkCard';

interface ArtworkDetailContentProps {
  artwork: any;
  artistSlug: string;
  otherArtworks: any[];
}

export default function ArtworkDetailContent({ 
  artwork, 
  artistSlug, 
  otherArtworks 
}: ArtworkDetailContentProps) {
    const { t } = useLanguage();
  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
        {t.artwork} <span className="text-[16px] font-sans">/ {artwork.title}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 mb-12 lg:mb-20">
        {/* Image Gallery */}
        <div className="mb-6 lg:mb-0">
          <div className="relative aspect-square">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ 
              objectFit: 'contain',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            />
          </div>
        </div>

        {/* Details */}
        <div>
          {/* Use artist slug if available, otherwise fall back to ID */}
          <Link
            href={artistSlug ? `/artists/${artistSlug}` : `/artists/${artwork.artistId}`}
            className="text-[16px] lg:text-lg link-underline block mb-3"
          >
            {artwork.artistName}
          </Link>
          <h2 className="text-[22px] lg:text-[28px] font-medium mb-4.5 md:mb-6">
            {artwork.title}, {artwork.year}
          </h2>
          <p className="text-base lg:text-lg italic mb-1">{artwork.medium}</p>
          <p className="text-base lg:text-lg italic mb-4.5 lg:mb-6">
            {artwork.dimensions.width} × {artwork.dimensions.height}{' '}
            {artwork.dimensions.unit}
          </p>

          <p className="text-[28px] font-medium mb-4.5 lg:mb-6">
            {artwork.currency === 'EUR' ? '€' : artwork.currency}
            {artwork.price.toLocaleString()}
          </p>

          <p className="text-xs leading-4 text-black mb-4 lg:mb-6">
            {t.taxesShipping}
          </p>

          {/* Use artwork slug in checkout URL for better readability */}
          <Link
            href={artwork.available ? `/checkout/${artwork.slug}` : '#'}
            className={`block w-full text-center py-3 lg:py-4 rounded-[40px] mb-15 lg:mb-12 font-medium text-sm transition-colors ${
              artwork.available 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <p className={artwork.available ? 'text-white' : 'text-gray-500'}>
              {artwork.available ? t.purchase : t.soldOut}
            </p>
          </Link>

          <div>
            <h3 className="text-[22px]">{t.artistNote}</h3>
            <hr className='my-5 opacity-20'/>
            <p className="text-sm text-gray-700 leading-4.75">
              {artwork.description}
            </p>
          </div>
        </div>
      </div>

      {/* Other artworks by artist */}
      {otherArtworks.length > 0 && (
        <section>
          <h2 className="text-[22px]">
            {t.otherArtworksByArtist} {artwork.artistName}
          </h2>
          <hr className='my-5 opacity-20'/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-16.75">
            {otherArtworks.map((art) => (
              <Link key={art.id} href={`/artworks/${art.slug}`}>
                <ArtworkCard artwork={art} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}