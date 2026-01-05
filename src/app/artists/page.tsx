'use client';

import { useState } from 'react';
import { artists, paginateItems, getTotalPages } from '@/lib/data';
import ArtistCard from '@/components/ArtistCard';
import Pagination from '@/components/Pagination';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ArtistsPage() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  
  const totalPages = getTotalPages(artists.length, itemsPerPage);
  const paginatedArtists = paginateItems(artists, currentPage, itemsPerPage);

  return (
    <main className="px-4 py-8 lg:px-[100px] lg:py-12">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-3xl font-medium">
          {t.artists} <span className="text-gray-400">/ {t.artistsCount(artists.length)}</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {paginatedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
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