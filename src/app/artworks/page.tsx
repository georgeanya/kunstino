'use client';

import { useState, useEffect } from 'react';
import { getArtworks, transformArtworkFromAPI } from '@/lib/api/artworks';
import ArtworkCard from '@/components/ArtworkCard';
import Pagination from '@/components/Pagination';
import { useLanguage } from '@/contexts/LanguageContext';
import { Artwork } from '@/lib/types';

export default function ArtworksPage() {
  const { t } = useLanguage();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 16;

  // Fetch artworks when page changes
  useEffect(() => {
    async function fetchArtworks() {
      try {
        setLoading(true);
        const data = await getArtworks({
          page: currentPage,
          limit: itemsPerPage
        });
        
        const transformedArtworks: Artwork[] = data.artworks.map(transformArtworkFromAPI);
        setArtworks(transformedArtworks);
        setTotalPages(data.pagination.totalPages);
        setTotalItems(data.pagination.totalItems);
      } catch (err) {
        console.error('Failed to fetch artworks:', err);
        setError('Failed to load artworks. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchArtworks();
  }, [currentPage]);

  if (loading && artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
  </div>
    );
  }

  if (error && artworks.length === 0) {
    return (
      <main className="px-4 lg:px-25 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
        {t.artworks} <span className="text-[16px] font-sans">/ {t.artworksCount(artworks.length)}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
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