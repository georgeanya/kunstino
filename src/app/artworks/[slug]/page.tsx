import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArtworkBySlug, getArtistBySlug, getArtworksByArtist, transformArtworkFromAPI } from '@/lib/api/artworks';
import ArtworkCard from '@/components/ArtworkCard';


interface PageProps {
  params: Promise<{ slug: string }>; // Changed from id to slug
}

export default async function ArtworkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    // Fetch artwork details by slug
    const apiArtwork = await getArtworkBySlug(slug);
    const artwork = transformArtworkFromAPI(apiArtwork);
    
    let artistSlug = '';
    try {
      
      const artistResponse = await getArtistBySlug(artwork.artistId); // This might not work if you need artist ID
     
      artistSlug = artistResponse?.slug || '';
    } catch (error) {
      console.warn('Could not fetch artist slug:', error);
    }

    // Fetch other artworks by the same artist
    const apiOtherArtworks = await getArtworksByArtist(artwork.artistId);
    const otherArtworks = apiOtherArtworks
      .map(transformArtworkFromAPI)
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
            <div className="relative aspect-square bg-gray-100">
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
            {/* Use artist slug if available, otherwise fall back to ID */}
            <Link
              href={artistSlug ? `/artists/${artistSlug}` : `/artists/${artwork.artistId}`}
              className="text-[16px] lg:text-lg link-underline block mb-3"
            >
              {artwork.artistName}
            </Link>
            <h2 className="text-[22px] lg:text-[28px] font-medium mb-4.5 md:mb-6">
              {artwork.title}, {artwork.year}
            </h2>
            <p className="text-base lg:text-lg italic mb-1">{artwork.medium}</p>
            <p className="text-base lg:text-lg italic mb-4.5 lg:mb-6">
              {artwork.dimensions.width} × {artwork.dimensions.height}{' '}
              {artwork.dimensions.unit}
            </p>

            <p className="text-[28px] font-medium mb-4.5 lg:mb-6">
              {artwork.currency === 'EUR' ? '€' : artwork.currency}
              {artwork.price.toLocaleString()}
            </p>

            <p className="text-xs leading-4 text-black mb-4 lg:mb-6">
              Taxes and shipping included for delivery to Germany. 14 working days
              of estimated delivery time
            </p>

            {/* Use artwork slug in checkout URL for better readability */}
            <Link
              href={artwork.available ? `/checkout/${artwork.slug}` : '#'}
              className={`block w-full text-center py-3 lg:py-4 rounded-[40px] mb-15 lg:mb-12 font-medium text-sm transition-colors ${
                artwork.available 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <p className={artwork.available ? 'text-white' : 'text-gray-500'}>
                {artwork.available ? 'Purchase' : 'Sold Out'}
              </p>
            </Link>

            <div>
              <h3 className="text-[22px]">Artist's note</h3>
              <hr className='my-5 opacity-20'/>
              <p className="text-sm text-gray-700 leading-4.75">
                {artwork.description}
              </p>
            </div>

            {/* Additional Artwork Details
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Artwork Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-medium capitalize">{apiArtwork.category || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Style</p>
                  <p className="font-medium">
                    {Array.isArray(apiArtwork.style) 
                      ? apiArtwork.style.join(', ') 
                      : 'Not specified'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600">Edition</p>
                  <p className="font-medium">
                    {apiArtwork.is_unique ? 'Unique piece' : 'Limited edition'}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-medium capitalize">{apiArtwork.status}</p>
                </div>
              </div>
            </div> */}
            
           
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
              {otherArtworks.map((art) => (
                <Link key={art.id} href={`/artworks/${art.slug}`}>
                  <ArtworkCard artwork={art} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    );
    
  } catch (error) {
    console.error('Error fetching artwork:', error);
    notFound();
  }
}