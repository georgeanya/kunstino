'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AlternateHeader from '@/components/layout/Header2';
import AlternateFooter from '@/components/layout/Footer2';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define URLs for alternate layout
  const alternatePaths = [
   
    
    '/checkout/*',
  ];
  
  // Helper to check if path matches alternate paths
  const isAlternateLayout = () => {
    if (alternatePaths.includes(pathname)) return true;
    
    for (const path of alternatePaths) {
      if (path.endsWith('/*') && pathname.startsWith(path.slice(0, -2))) {
        return true;
      }
    }
    
    return false;
  };
  
  const useAlternateLayout = isAlternateLayout();
  
  return (
    <>
      {useAlternateLayout ? <AlternateHeader /> : <Header />}
      {children}
      {useAlternateLayout ? <AlternateFooter /> : <Footer />}
    </>
  );
}