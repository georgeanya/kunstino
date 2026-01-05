import Link from 'next/link';
import Image from 'next/image';
import { Artwork } from '@/lib/types';

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link
      href={`/artworks/${artwork.id}`}
      className="group block"
    >
      <div className="relative aspect-3/4 bg-gray-100 mb-3 overflow-hidden">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-cover group-hover:opacity-90 transition-opacity duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm text-black">{artwork.artistName}</h3>
        <p className="text-sm text-gray-600 italic">
          {artwork.title}, {artwork.year}
        </p>
        <p className="text-sm text-black">
          {artwork.currency}{artwork.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}