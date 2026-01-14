'use client';

import { useState, useEffect } from 'react';
import { getArtists, transformArtistFromAPI } from '@/lib/api/artworks';
import ArtistCard from '@/components/ArtistCard';
import Pagination from '@/components/Pagination';
import { useLanguage } from '@/contexts/LanguageContext';
import { Artist } from '@/lib/types';

export default function ArtistsPage() {
  const { t } = useLanguage();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 16;

  // Fetch artists on component mount
  useEffect(() => {
    async function fetchArtists() {
      try {
        setLoading(true);
        const data = await getArtists();
        const transformedArtists: Artist[] = data.map((artist: any) => transformArtistFromAPI(artist));
        setArtists(transformedArtists);
      } catch (err) {
        console.error('Failed to fetch artists:', err);
        setError('Failed to load artists. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchArtists();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(artists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtists = artists.slice(startIndex, startIndex + itemsPerPage);

  if (loading && artists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
  </div>
    );
  }

  if (error && artists.length === 0) {
    return (
      <main className="px-4 lg:px-25 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
        {t.artists} <span className="text-[16px] font-sans">/ {t.artistsCount(artists.length)}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16.75">
            {paginatedArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </main>
  );
}