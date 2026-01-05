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
    <main className="px-4 py-8 lg:px-[100px] lg:py-12">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-3xl font-medium">
          {t.artworks} <span className="text-gray-400">/ {t.artworksCount(artworks.length)}</span>
        </h1>
      </div>

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