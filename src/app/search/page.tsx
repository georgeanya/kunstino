'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ArtworkCard from '@/components/ArtworkCard';
import { fetchAllArtworks, searchArtworksClientSide, transformToArtworkType } from '@/lib/api/search';
import { useLanguage } from '@/contexts/LanguageContext';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useLanguage();
  const [allArtworks, setAllArtworks] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load all artworks on component mount
  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        console.log('Loading artworks for search page...');
        
        const artworks = await fetchAllArtworks();
        console.log(`Loaded ${artworks.length} artworks`);
        
        setAllArtworks(artworks);
        
        // If there's a search query, perform initial search
        if (query && artworks.length > 0) {
          performSearch(query, artworks);
        }
      } catch (error) {
        console.error('Failed to load artworks:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadArtworks();
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (query && allArtworks.length > 0) {
      performSearch(query, allArtworks);
    } else {
      setSearchResults([]);
    }
  }, [query, allArtworks]);

  const performSearch = (searchQuery: string, artworks: any[]) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    
    // Perform client-side search
    const results = searchArtworksClientSide(artworks, searchQuery);
    
    // Transform to artwork format for ArtworkCard
    const transformedResults = results.map(transformToArtworkType);
    
    console.log(`Search for "${searchQuery}" found ${transformedResults.length} results`);
    setSearchResults(transformedResults);
    setSearchLoading(false);
  };

  // Show all artworks transformed for display
  const allArtworksForDisplay = allArtworks.map(transformToArtworkType);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
  </div>
    );
  }

  return (
    <main className="px-4 lg:px-25 min-h-screen">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-normal mb-4">
          {query ? (
            <>
              {t.artworks} <span className="text-[16px] font-sans">/ {t.resultsFor} "{query}"</span>
            </>
          ) : (
            'Search Artworks'
          )}
        </h1>
        <hr className="my-5 opacity-20" />
      </div>

      {/* Loading State for Search */}
      {searchLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}

      {/* Search Results */}
      {!searchLoading && query && (
        <>
          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-2">No artworks found</h2>
              <p className="text-gray-500">Try different search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16">
              {searchResults.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Show all artworks when no search */}
      {!query && !loading && (
        <div>
          <h2 className="text-xl font-serif font-normal mb-6">
            Browse All Artworks
            <span className="text-base font-sans text-gray-600 ml-2">
              ({allArtworksForDisplay.length} artworks)
            </span>
          </h2>
          
          {allArtworksForDisplay.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No artworks available</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16">
              {allArtworksForDisplay.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}