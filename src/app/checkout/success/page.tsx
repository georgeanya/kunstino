'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CheckoutSuccessPage() {
  const { t } = useLanguage();
  
  const artwork = {
    artist: 'Olumide Osamede',
    title: 'Green Artwork',
    year: 2020,
    medium: 'Oil on canvas',
    dimensions: '24 X 24 in',
    imageUrl: '/images/artworks/green-artwork.jpg',
  };

  return (
    <main className="flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl lg:text-[32px] font-serif mt-19 md:mt-0 text-center mb-8">
          {t.thankYouOrder}
        </h1>

        <div className="bg-[#F2F2F2] p-5 rounded-lg mb-8 md:mb-10">
          <div className="flex gap-4">
            <div className="relative w-24 h-32 bg-gray-200 shrink-0 rounded overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className=" mb-1 md:text-base text-sm">{artwork.artist}</h3>
              <p className="md:text-base text-sm text-black font-light italic mb-4">
                {artwork.title}, {artwork.year}
              </p>
              <p className="md:text-sm text-xs text-black font-light">{artwork.medium}</p>
              <p className="md:text-sm text-xs text-black font-light">{artwork.dimensions}</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm md:text-base text-black mb-6">
            {t.orderPlaced}
          </p>
            <hr className='mb-6 mt-8 opacity-20'/>
          <div className="bg-white text-left mb-6">
            <ul className="space-y-2 text-sm md:text-base list-disc pl-5 md:pl-6">
              <li>
                <span className="">{t.bankName}:</span> Deutsche Bank
              </li>
              <li>
                <span className="">{t.accountName}:</span> Kunstino UG
              </li>
              <li>
                <span className="">{t.accountNumber}:</span> 3537783483
              </li>
            </ul>
          </div>
            <hr className='my-6 md:mb-8 opacity-20'/>
          <p className="text-sm md:text-base text-black">
            {t.paymentDeadline}
          </p>
        </div>

        <div className="text-center mt-10 md:mt-20 text-xs text-black">
          {t.contactHelp.split('{contact}')[0]}
          <Link href="/contact" className="link-underline hover:text-black">
            {t.contact}
          </Link>
          {t.contactHelp.split('{contact}')[1]}
        </div>
      </div>
    </main>
  );
}