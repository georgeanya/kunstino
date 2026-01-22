import { notFound } from 'next/navigation';
import { getStoryBySlug, getArtworksByArtist, transformArtworkFromAPI, transformStoryFromAPI, transformRelatedStoryFromAPI } from '@/lib/api/artworks';
import StoryDetailContent from '@/components/StoryDetail';

const API_BASE_URL = "https://kunstino-backend-production.up.railway.app/v1";

export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE_URL}/story`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('Failed to fetch stories for static params:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    if (data.status !== "Success") {
      console.error('API error:', data.message);
      return [];
    }
    
    const stories = data.data?.data || []; // Note: stories are in data.data.data
    
    return stories.map((story: any) => ({
      slug: story.slug || story._id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    const storyData = await getStoryBySlug(slug);
    
    if (!storyData?.story) {
      notFound();
    }

    const story = transformStoryFromAPI(storyData.story);
    const relatedStories = storyData.related?.map(transformRelatedStoryFromAPI) || [];
    
    // Fetch artworks by the story's author if needed
    let artworks: any[] = [];
    try {
      if (storyData.story.author?._id) {
        const apiArtworks = await getArtworksByArtist(storyData.story.author._id);
        artworks = apiArtworks.map(transformArtworkFromAPI);
      }
    } catch (error) {
      console.error('Error fetching artist artworks:', error);
      // Continue without artworks if there's an error
    }

    return <StoryDetailContent 
      story={story} 
      artworks={artworks} 
      relatedStories={relatedStories} 
      apiStory={storyData.story} 
    />;
  } catch (error) {
    console.error('Error loading story:', error);
    notFound();
  }
}