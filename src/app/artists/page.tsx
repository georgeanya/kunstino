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
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] lg:text-[32px]">
          {t.artists} <span className="text-[16px]">/ {t.artistsCount(artists.length)}</span>
        </h1>
      <hr className='my-5 opacity-20'/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16.75">
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