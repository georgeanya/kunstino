'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedArtworks, getFeaturedArtists } from '@/lib/data';
import ArtworkCard from '@/components/ArtworkCard';
import ArtistCard from '@/components/ArtistCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const featuredArtworks = getFeaturedArtworks();
  const featuredArtists = getFeaturedArtists();
  const heroArtwork = featuredArtworks[1];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] bg-gray-100 overflow-hidden">
        <Image
          src={heroArtwork.imageUrl}
          alt={heroArtwork.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-4 lg:bottom-8 lg:left-[100px] text-white z-10">
          <p className="text-xs lg:text-sm mb-2">{t.artMoment}</p>
          <h1 className="text-2xl lg:text-3xl font-medium mb-1">
            {heroArtwork.title}
          </h1>
          <p className="text-xs lg:text-sm opacity-90">
            {heroArtwork.artistName} at {heroArtwork.year}
          </p>
        </div>
        
        {/* Navigation Arrows */}
        <div className="absolute bottom-6 right-4 lg:bottom-8 lg:right-[100px] flex gap-2 z-10">
          <button className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </section>

      <div className="px-4 lg:px-[100px]">
        {/* Artworks Section */}
        <section className="py-12 lg:py-16">
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-medium">{t.artworks}</h2>
            <Link
              href="/artworks"
              className="text-xs lg:text-sm text-gray-600 hover:text-black transition-colors underline"
            >
              {t.viewAllWorks}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredArtworks.slice(0, 8).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>

        {/* Artists Section */}
        <section className="py-12 lg:py-16">
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-medium">{t.artists}</h2>
            <Link
              href="/artists"
              className="text-xs lg:text-sm text-gray-600 hover:text-black transition-colors underline"
            >
              {t.viewAllArtists}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featuredArtists.slice(0, 8).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
