'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

import mail from '../../../public/icons/mail.svg';
import search from '../../../public/icons/search.svg';
import logo from '../../../public/assets/KUNSTiNO.svg';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navLinks = [
    { href: '/artworks', label: t?.artworks },
    { href: '/artists', label: t?.artists },
    { href: '/stories', label: t?.stories },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
      setShowMobileSearch(false);
    }
  };

  // Clear search when navigating away
  useEffect(() => {
    setSearchQuery('');
    setShowMobileSearch(false);
  }, [pathname]);

  // Toggle language between en and de
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'de' : 'en';
    setLanguage(newLanguage);
  };

  // Get current flag based on language
  const getCurrentFlagEmoji = () => {
    return language === 'en' ? '🇩🇪' : '🇬🇧';
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
            <Image
              src={logo}
              alt="KUNSTiNO"
              width={86}
              height={23}
              priority
              quality={100}
            />
          </Link>

          {/* Safari-compatible language selector */}
          <div className="flex items-center relative">
            <button
                onClick={toggleLanguage}
                className="flex items-center transition-colors focus:outline-none"
              >
                <span className="text-2xl">{getCurrentFlagEmoji()}</span>
              </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-white z-40"
          >
            <div className="flex items-center justify-between px-4 h-16">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
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

              {/* Safari-compatible language selector */}
              <div className="flex items-center relative">
                <button
                onClick={toggleLanguage}
                className="flex items-center focus:outline-none"
                style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    minHeight: '44px',
                    minWidth: '44px',
                  }}
              >
                <span className="text-lg">{getCurrentFlagEmoji()}</span>
              </button>
              </div>
            </div>

            <div className="px-4 py-4 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
              <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <div className="flex-1 flex items-center">
                  <button 
                    onClick={toggleSearch}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    className="p-2"
                  >
                    <Image
                      src={search}
                      alt="Search"
                      width={20}
                      height={20}
                      quality={100}
                    />
                  </button>
                  <input
                    type="text"
                    placeholder={t?.searchPlaceholder || 'Search artworks...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-9 px-2 py-2 bg-[#F2F2F2] rounded-[3px] text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <button type="submit" className="p-2">
                  <Image
                    src={mail}
                    alt="Mail"
                    width={20}
                    height={20}
                    quality={100}
                  />
                </button>
              </form>
              
              <nav className="space-y-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
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
                  placeholder={t?.search || 'Search artworks...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
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
                <button
                onClick={toggleLanguage}
                className="flex items-center transition-colors focus:outline-none"
              >
                <span className="text-2xl">{getCurrentFlagEmoji()}</span>
              </button>
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