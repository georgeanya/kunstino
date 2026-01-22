'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ArtworkCard from '@/components/ArtworkCard';
import { useLanguage } from '@/contexts/LanguageContext';

// Inline functions - NO EXPORTS
const fetchAllArtworks = async () => {
  try {
    const response = await fetch("https://kunstino-backend-production.up.railway.app/v1/artwork?page=1&limit=500", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artworks: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== "Success" || !data.data?.artworks) {
      return [];
    }

    // Transform API response
    return data.data.artworks.map((artwork: any) => {
      const imageUrl =
        artwork.images?.find((img: any) => img.is_primary)?.url ||
        artwork.images?.[0]?.url ||
        "";

      return {
        id: artwork._id || "",
        title: artwork.title || "",
        description: artwork.description || "",
        artistName: artwork.artist_name || "",
        artistId: artwork.artist || "",
        artistSlug: artwork.artist_slug || "",
        medium: artwork.medium || "",
        style: artwork.style || [],
        subject: artwork.subject || [],
        category: artwork.category || "",
        imageUrl: imageUrl,
        slug: artwork.slug || "",
        year: artwork.year_created,
        price: artwork.price,
        currency: artwork.currency,
        available: artwork.status === "available",
      };
    });
  } catch (error) {
    console.error("Error fetching artworks for search:", error);
    return [];
  }
};

const searchArtworksClientSide = (artworks: any[], query: string) => {
  if (!query.trim() || artworks.length === 0) {
    return [];
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  if (searchTerms.length === 0) {
    return [];
  }

  return artworks.filter((artwork) => {
    const searchText = [
      artwork.title,
      artwork.artistName,
      artwork.medium,
      artwork.description,
      ...(artwork.style || []),
      ...(artwork.subject || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchTerms.some(
      (term) => term.length > 1 && searchText.includes(term),
    );
  });
};

const transformToArtworkType = (artworkData: any) => {
  return {
    id: artworkData.id,
    title: artworkData.title,
    artistId: artworkData.artistId,
    artistSlug: artworkData.artistSlug,
    artistName: artworkData.artistName,
    year: artworkData.year || 0,
    medium: artworkData.medium,
    dimensions: {
      width: 0,
      height: 0,
      unit: "cm" as const,
    },
    price: artworkData.price || 0,
    currency: artworkData.currency || "USD",
    imageUrl: artworkData.imageUrl,
    description: artworkData.description,
    available: artworkData.available,
    featured: false,
    slug: artworkData.slug,
  };
};

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useLanguage();
  const [allArtworks, setAllArtworks] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    async function loadArtworks() {
      try {
        setLoading(true);
        const artworks = await fetchAllArtworks();
        setAllArtworks(artworks);
        
        if (query && artworks.length > 0) {
          setSearchLoading(true);
          const results = searchArtworksClientSide(artworks, query);
          const transformedResults = results.map(transformToArtworkType);
          setSearchResults(transformedResults);
          setSearchLoading(false);
        }
      } catch (error) {
        console.error('Failed to load artworks:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadArtworks();
  }, []);

  useEffect(() => {
    if (query && allArtworks.length > 0) {
      setSearchLoading(true);
      const results = searchArtworksClientSide(allArtworks, query);
      const transformedResults = results.map(transformToArtworkType);
      setSearchResults(transformedResults);
      setSearchLoading(false);
    } else {
      setSearchResults([]);
    }
  }, [query, allArtworks]);

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

      {searchLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}

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