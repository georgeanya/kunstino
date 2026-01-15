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
      <div className="relative aspect-square bg-gray-100 mb-3 overflow-hidden">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          className="object-fill group-hover:opacity-90 transition-opacity duration-300"
            width={260}
        height={260}
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-black">{artwork.artistName}</h3>
        <p className="text-xs text-black italic">
          {artwork.title}, {artwork.year}
        </p>
        <p className="text-xs md:text-sm opacity-50 text-black">
          {artwork.currency === 'EUR' ? '€' : artwork.currency}{artwork.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}