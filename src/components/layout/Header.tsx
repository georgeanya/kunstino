'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';
import globe from '../../../public/icons/world.svg';
import mail from '../../../public/icons/mail.svg';
import search from '../../../public/icons/search.svg';
import logo from '../../../public/assets/KUNSTiNO.svg';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navLinks = [
    { href: '/artworks', label: t?.artworks || 'Artworks' },
    { href: '/artists', label: t?.artists || 'Artists' },
    { href: '/stories', label: t?.stories || 'Stories' },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  // Handle language change for all browsers
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value.toLowerCase();
    if (lang === 'en' || lang === 'de') {
      setLanguage(lang as Language);
    }
  };

  const toggleSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Close mobile menu when language changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [language]);

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <Link href="/" className="text-xl font-serif tracking-wider">
            <img
              src={logo.src}
              alt="KUNSTiNO"
              width={86}
              height={23}
            />
          </Link>

          
          <div className="flex items-center relative">
            <img
              src={globe.src}
              alt="Language"
              width={16}
              height={16}
              className="pointer-events-none absolute left-0 z-10"
            />
            <select
              value={language.toUpperCase()}
              onChange={handleLanguageChange}
              className="appearance-none bg-transparent border-none text-xs font-light pl-5 pr-1 cursor-pointer focus:outline-none"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                minHeight: '44px',
                minWidth: '44px',
              }}
            >
              <option value="EN">EN</option>
              <option value="DE">DE</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="h-vh border-gray-200 bg-white">
            <div className="px-4 py-4">
              <div className='flex gap-4 justify-between w-full'>
                <div className="w-full text-left flex items-center gap-2">
                  <button 
                    onClick={toggleSearch}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      toggleSearch();
                    }}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <img
                      src={search.src}
                      alt="Search"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                <form onSubmit={handleSearch} className="">
                  <button>
                    <input
                      type="text"
                      placeholder={t?.searchPlaceholder || 'Search artworks, artists...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-67.5 h-9 px-2 py-2 bg-[#F2F2F2] rounded-[3px] text-sm ${showMobileSearch ? 'opacity-100' : 'opacity-0'} focus:outline-none focus:ring-1 focus:ring-black`}
                    />
                  </button>
                </form>
                <div className="w-full py-2 flex items-end justify-end">
                  <img
                    src={mail.src}
                    alt="Mail"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <nav className="space-y-8 mt-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    onTouchEnd={() => setMobileMenuOpen(false)}
                    className={`block text-[16px] font-serif ${
                      isActive(link.href) ? 'text-black' : 'text-gray-700'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="px-25">
          <div className="flex justify-between items-center pt-10.5 pb-5">
            <div className="flex-1 max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t?.search || 'Search artworks, artists...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-45 pl-9 pr-4 py-2 bg-[#F2F2F2] border-none rounded-[3px] text-sm text-[#000000] focus:outline-none focus:ring-1 placeholder:text-[#000000] placeholder:font-light placeholder:text-xs"
                />
              </form>
            </div>

            <div className="flex-2 flex justify-center">
              <Link href="/" className="text-2xl font-serif tracking-wider">
                <Image
                  src={logo}
                  alt="KUNSTiNO"
                  width={110}
                  height={18}
                />
              </Link>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
              <button className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                <Image
                  src={mail}
                  alt="Search"
                  width={16}
                  height={16}
                />
              </button>
              <div className="flex items-center gap-l-2">
                <Image
                  src={globe}
                  alt="Language"
                  width={16}
                  height={16}
                />
                <select
                  value={language.toUpperCase()}
                  onChange={handleLanguageChange}
                  className="text-sm font-light border-none bg-transparent cursor-pointer focus:outline-none"
                >
                  <option value="EN">EN</option>
                  <option value="DE">DE</option>
                </select>
              </div>
            </div>
          </div>

          <nav className="flex justify-center gap-30 pb-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[16px] transition-colors ${
                  isActive(link.href)
                    ? 'text-black font-normal'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}