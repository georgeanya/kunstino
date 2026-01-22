'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import ArtworkCard from '@/components/ArtworkCard';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Story, Artwork } from '@/lib/types';
import StoryCard from './StoryCard';

interface StoryDetailContentProps {
  story: Story;
  artworks: Artwork[];
  relatedStories?: Story[];
  apiStory?: any;
}

export default function StoryDetailContent({ story, artworks, relatedStories, apiStory }: StoryDetailContentProps) {
  const { t } = useLanguage();

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
        {t.story}
      </h1>
      <hr className='my-5 opacity-20'/>
      
      <div className=" mb-12 lg:mb-20 md:px-45.75">
        {/* Story Featured Image */}
        {story.featuredImage?.url && (
        <div className="relative w-full aspect-5/3 max-w-4xl md:mb-10 mb-8">
          <Image
            src={story.featuredImage.url}
            alt={story.featuredImage.alt || story.title}
            fill={true} 
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
        </div>
        )}

        {/* Story Info */}
        <div className="">
          <h2 className="md:text-[28px] text-[26px] font-medium mb-3">{story.title}</h2>          
          <div className="mb-6">
            <p className="text-base italic">By {story.author.name} · {story.publishedDate}</p>
          </div>
          <div className="reactMarkDown text-black mb-6">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {story.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      

      {/* Related Stories */}
      {relatedStories && relatedStories.length > 0 && (
        <section>
          <h2 className="text-[22px]">{t.relatedStories}</h2>
          <hr className='my-5 opacity-20'/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16.75">
            {relatedStories.map((relatedStory) => (
              <StoryCard key={relatedStory.id} story={relatedStory} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}