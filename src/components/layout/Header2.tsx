'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '../../../public/assets/KUNSTiNO.svg';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { href: '/artworks', label: t?.artworks || 'Artworks' },
    { href: '/artists', label: t?.artists || 'Artists' },
    { href: '/stories', label: t?.stories || 'Stories' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  // Toggle language between en and de
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'de' : 'en';
    setLanguage(newLanguage);
  };

  // Get current flag based on language
  const getCurrentFlagEmoji = () => {
  return language === 'en' ? '🇩🇪' : '🇬🇧';
};


  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Empty space on left to balance the right language button */}
          <div className="w-16"></div>
          
          {/* Centered logo for mobile */}
          <div className="flex justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-xl font-serif tracking-wider">
              <Image
                src={logo}
                alt="KUNSTiNO"
                width={86}
                height={23}
                priority
                quality={100}
              />
            </Link>
          </div>

          {/* Language button on right end for mobile */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50 transition-colors focus:outline-none"
              style={{ 
                minHeight: '44px',
                minWidth: '44px',
              }}
            >
              <span className="text-lg">{getCurrentFlagEmoji()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="px-25">
          <div className="flex justify-between items-center pt-10.5 pb-5">
            {/* Centered logo - absolute positioning */}
            <div className="flex justify-center absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="text-2xl font-serif tracking-wider">
                <Image
                  src={logo}
                  alt="KUNSTiNO"
                  width={110}
                  height={18}
                />
              </Link>
            </div>

            {/* Language button on right end for desktop */}
            <div className="flex items-center gap-4 ml-auto">
              
              {/* Language toggle button */}
              <button
                onClick={toggleLanguage}
                className="flex items-center transition-colors focus:outline-none"
              >
                <span className="text-2xl">{getCurrentFlagEmoji()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}