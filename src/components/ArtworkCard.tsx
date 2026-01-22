import Link from 'next/link';
import Image from 'next/image';
import { Artwork } from '@/lib/types';

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link
      href={`/artworks/${artwork.slug}`}
      className="group block"
    >
      <div className="relative aspect-square bg-transparent mb-3 overflow-hidden">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          className="group-hover:opacity-90 transition-opacity duration-300"
            width={260}
        height={260}
        style={{ 
              objectFit: 'contain',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-black">{artwork.artistName}</h3>
        <p className="text-xs md:text-sm text-black italic">
          {artwork.title}, {artwork.year}
        </p>
        <p className="text-xs  opacity-50 text-black">
          {artwork.currency === 'EUR' ? '€' : artwork.currency}{artwork.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}