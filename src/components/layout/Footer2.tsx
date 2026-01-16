'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className=" mt-20">
      <div className="">
        <hr className='mb-6 mt-8 opacity-20'/>
        <p className='my-6 text-center text-xs'>{t.contactHelp.beforeContact}&nbsp;
        <Link href="/contact" className="link-underline hover:text-black">
          {t.contact}
        </Link>
        &nbsp;{t.contactHelp.afterContact}</p>
      </div>
    </footer>
  );
}