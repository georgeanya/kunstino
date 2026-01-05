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
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-serif tracking-wider">
            KUNSTiNO
          </Link>
        </div>

        <h1 className="text-2xl lg:text-3xl font-serif text-center mb-8">
          {t.thankYouOrder}
        </h1>

        <div className="bg-[#F2F2F2] p-6 rounded-lg mb-8">
          <div className="flex gap-4 mb-6">
            <div className="relative w-24 h-32 bg-gray-200 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium mb-1">{artwork.artist}</h3>
              <p className="text-sm text-gray-600 italic mb-2">
                {artwork.title}, {artwork.year}
              </p>
              <p className="text-sm text-gray-600">{artwork.medium}</p>
              <p className="text-sm text-gray-600">{artwork.dimensions}</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-700 mb-6">
            {t.orderPlaced}
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-6 text-left mb-6">
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium">{t.bankName}:</span> Deutsche Bank
              </li>
              <li>
                <span className="font-medium">{t.accountName}:</span> Kunstino UG
              </li>
              <li>
                <span className="font-medium">{t.accountNumber}:</span> 3537783483
              </li>
            </ul>
          </div>

          <p className="text-xs text-gray-600">
            {t.paymentDeadline}
          </p>
        </div>

        <div className="text-center text-xs text-gray-600">
          {t.contactHelp.split('{contact}')[0]}
          <Link href="/contact" className="underline hover:text-black">
            {t.contact}
          </Link>
          {t.contactHelp.split('{contact}')[1]}
        </div>
      </div>
    </main>
  );
}