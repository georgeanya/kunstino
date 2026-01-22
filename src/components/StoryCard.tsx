import Link from 'next/link';
import Image from 'next/image';
import { Story } from '@/lib/types';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group block"
    >
      <div className="relative aspect-square mb-3 overflow-hidden">
      <Image
        src={story.featuredImage.url}
        alt={story.featuredImage.alt || story.title}
        fill
         className="object-cover w-full h-full"
        sizes="(max-width: 768px) 260px, 260px"
      />
    </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm text-black">{story.title}</h3>
        <p className="text-xs text-black">
          {story.author.name}
        </p>
      </div>
    </Link>
  );
}
