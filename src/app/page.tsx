'use client';

import { useState, useEffect } from 'react';
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
  
  // Get two hero artworks (use the first two featured artworks)
  const heroArtworks = featuredArtworks.slice(0, 2);
  
  // State to track current hero image
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroArtworks.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroArtworks.length]);

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % heroArtworks.length);
    setIsAutoPlaying(false);
  };

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + heroArtworks.length) % heroArtworks.length);
    setIsAutoPlaying(false);
  };

  const goToHero = (index: number) => {
    setCurrentHeroIndex(index);
    setIsAutoPlaying(false);
  };

  const currentArtwork = heroArtworks[currentHeroIndex];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-100 lg:h-125 bg-gray-100 overflow-hidden">
        {/* Hero Images */}
        {heroArtworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="absolute bottom-6 left-4 lg:bottom-8 lg:left-25 text-white z-10">
          <p className="text-xs lg:text-sm mb-2">{t.artMoment}</p>
          <h1 className="text-2xl lg:text-3xl font-medium mb-1">
            {currentArtwork.title}
          </h1>
          <p className="text-xs lg:text-sm opacity-90">
            {currentArtwork.artistName} at {currentArtwork.year}
          </p>
        </div>
      </section>

      {/* Navigation Section */}
      <section className="px-4 lg:px-25 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2">
            {heroArtworks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToHero(index)}
                className="flex-1 flex flex-col items-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                {/* Indicator line */}
                <div className={`w-full h-px transition-colors duration-300 ${
                  index === currentHeroIndex ? 'bg-black' : 'bg-gray-300'
                }`} />
              </button>
            ))}
          </div>

          {/* Buttons - sticks to the right */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={prevHero}
              className="w-10 h-10 rounded-full bg-white border border-[#000000] hover:bg-gray-50 flex items-center justify-center transition-all duration-300 hover:scale-105"
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextHero}
              className="w-10 h-10 rounded-full bg-white border border-[#000000] hover:bg-gray-50 flex items-center justify-center transition-all duration-300 hover:scale-105"
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <div className="px-4 lg:px-25">
        {/* Artworks Section */}
        <section className="pt-10">
          <div className="flex justify-between items-center">
            <h2 className="ttext-[22px] font-serif">{t.artworks}</h2>
            <Link
              href="/artworks"
              className="text-xs lg:text-[16px] text-gray-600 hover:text-black transition-colors link-underline"
            >
              {t.viewAllWorks}
            </Link>
          </div>
          <hr className='my-5 opacity-20'/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16">
            {featuredArtworks.slice(0, 8).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>

        {/* Artists Section */}
        <section className="pt-15 pb-20">
          <div className="flex justify-between items-center mb-6 lg:mb-8">
            <h2 className="text-[22px] font-serif">{t.artists}</h2>
            <Link
              href="/artists"
              className="text-xs lg:text-[16px] text-gray-600 hover:text-black transition-colors link-underline"
            >
              {t.viewAllArtists}
            </Link>
          </div>
          <hr className='my-5 opacity-20'/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16">
            {featuredArtists.slice(0, 8).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}