'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { getStories, transformStoryFromAPI } from '@/lib/api/artworks';
import StoryCard from '@/components/StoryCard';
import Pagination from '@/components/Pagination';
import { useLanguage } from '@/contexts/LanguageContext';
import { Story } from '@/lib/types';

export default function StoriesPage() {
  const { t } = useLanguage();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 16;

  // Fetch stories when page changes
  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        const response = await getStories({
          page: currentPage,
          limit: itemsPerPage
        });
        
        // Transform API stories to Story type
        const transformedStories: Story[] = response.stories.map((apiStory: any) => 
          transformStoryFromAPI(apiStory)
        );
        
        setStories(transformedStories);
        setTotalItems(response.pagination.totalItems);
      } catch (err) {
        console.error('Failed to fetch stories:', err);
        setError('Failed to load stories. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchStories();
  }, [currentPage]);

  // Calculate total pages from total items
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading && stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (error && stories.length === 0) {
    return (
      <main className="px-4 lg:px-25 min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
        {t.stories} <span className="text-[16px] font-sans">/ {t.storiesCount(stories.length)}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16.75">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
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