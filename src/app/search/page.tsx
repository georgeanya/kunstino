'use client';

import dynamic from 'next/dynamic';

// Load the search component dynamically with no SSR
const SearchPageClient = dynamic(
  () => import('../../components/SearchPageClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }
);

export default function SearchPage() {
  return <SearchPageClient />;
}