import Link from 'next/link';
import Image from 'next/image';
import { Artist } from '@/lib/types';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block"
    >
      <div className="relative aspect-square bg-gray-100 mb-3 overflow-hidden">
        <Image
          src={artist.imageUrl}
          alt={artist.name}
          className="object-cover group-hover:opacity-90 transition-opacity duration-300"
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
        <h3 className="font-medium text-sm text-black">{artist.name}</h3>
        <p className="text-xs text-black">
          {artist.nationality}, b. {artist.birthYear}
        </p>
      </div>
    </Link>
  );
}
