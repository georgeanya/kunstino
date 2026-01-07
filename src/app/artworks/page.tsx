'use client';

import { useState } from 'react';
import { artworks, paginateItems, getTotalPages } from '@/lib/data';
import ArtworkCard from '@/components/ArtworkCard';
import Pagination from '@/components/Pagination';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ArtworksPage() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  
  const totalPages = getTotalPages(artworks.length, itemsPerPage);
  const paginatedArtworks = paginateItems(artworks, currentPage, itemsPerPage);

  return (
    <main className="px-4 lg:px-25">
      
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
        {t.artworks} <span className="text-[16px] font-sans">/ {t.artworksCount(artworks.length)}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {paginatedArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}