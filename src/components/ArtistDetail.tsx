'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import ArtworkCard from '@/components/ArtworkCard';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArtistDetailContentProps {
  artist: any;
  artworks: any[];
  apiArtist: any;
}

export default function ArtistDetailContent({ artist, artworks, apiArtist }: ArtistDetailContentProps) {
  const { t } = useLanguage();

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
          {t.artist} <span className="text-[16px] font-sans">/ {artist.name}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      
      <div className="lg:flex lg:gap-12 mb-12 lg:mb-20">
        {/* Artist Image */}
        <div className="relative aspect-square mb-6">
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            width={500}
            height={500}
            className="object-cover md:min-w-80"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Artist Info */}
        <div>
          <h2 className="text-[28px] font-medium mb-1">{artist.name}</h2>
          
          {artist.nationality && (
            <p className="text-[20px] mb-6 text-black">
              {artist.nationality}
              {artist.birthYear && `, b. ${artist.birthYear}`}
            </p>
          )}
          
          {/* Bio */}
          {artist.bio && (
            <p className="text-sm leading-4.75 text-black mb-6">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {artist.bio}
      </ReactMarkdown>
            </p>
          )}
          
          {/* Social Links */}
          {apiArtist.social_links && (
            <div className="mt-4">
              {apiArtist.social_links.instagram && (
                <a 
                  href={`https://instagram.com/${apiArtist.social_links.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mr-4 text-sm text-blue-600 link-underline font-medium"
                >
                  Instagram
                </a>
              )}
              {apiArtist.social_links.website && (
                <a 
                  href={apiArtist.social_links.website.startsWith('http') ? apiArtist.social_links.website : `https://${apiArtist.social_links.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-600 link-underline font-medium"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Artist's Artworks */}
      <section>
        <h2 className="text-[22px]">
          {t.artworksByArtist} {artist.name}
        </h2>
        <hr className='my-5 opacity-20'/>
        {artworks.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-16.75">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          <p className="text-black">{t.noArtworks}</p>
        )}
      </section>
    </main>
  );
}