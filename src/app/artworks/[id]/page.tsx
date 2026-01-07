import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArtworkById, getArtworksByArtist, artworks } from '@/lib/data';
import ArtworkCard from '@/components/ArtworkCard';

export async function generateStaticParams() {
  return artworks.map((artwork) => ({
    id: artwork.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const artwork = getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  const otherArtworks = getArtworksByArtist(artwork.artistId)
    .filter((a) => a.id !== artwork.id)
    .slice(0, 4);

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
          Artwork <span className="text-[16px] font-sans">/ {artwork.title}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 mb-12 lg:mb-20">
        {/* Image Gallery */}
        <div className="mb-6 lg:mb-0">
          <div className="relative aspect-3/4 bg-gray-100">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Details */}
        <div>
          <Link
            href={`/artists/${artwork.artistId}`}
            className="text-[16px] lg:text-lg link-underline block mb-3"
          >
            {artwork.artistName}
          </Link>
          <h2 className="text-[22px] lg:text-[28px] font-medium mb-4.5 md:mb-6">
            {artwork.title}, {artwork.year}
          </h2>
          <p className="text-base lg:text-lg italic  mb-1">{artwork.medium}</p>
          <p className="text-base lg:text-lg italic  mb-4.5 lg:mb-6">
            {artwork.dimensions.width} X {artwork.dimensions.height}{' '}
            {artwork.dimensions.unit}
          </p>

          <p className="text-[28px] font-medium mb-4.5 lg:mb-6">
            {artwork.currency}{artwork.price.toLocaleString()}
          </p>

          <p className="text-xs leading-4 text-black mb-4 lg:mb-6">
            Taxes and shipping included for delivery to Germany. 14 working days
            of estimated delivery time
          </p>

          <Link
            href="/checkout"
            className="block w-full bg-black text-white text-center py-3 lg:py-4 rounded-[40px] hover:bg-gray-800 transition-colors mb-15 lg:mb-12 font-medium text-sm"
          >
            <p className='text-white'>Purchase</p>
          </Link>

          <div>
            <h3 className="text-[22px]">Artist's note</h3>
            <hr className='my-5 opacity-20'/>
            <p className="text-sm text-gray-700 leading-4.75">
              {artwork.description}
            </p>
          </div>
        </div>
      </div>

      {/* Other artworks by artist */}
      {otherArtworks.length > 0 && (
        <section>
          <h2 className="text-[22px]">
            Other artworks by {artwork.artistName}
          </h2>
          <hr className='my-5 opacity-20'/>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-16.75">
            {otherArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}