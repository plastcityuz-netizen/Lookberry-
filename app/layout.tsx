import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL('https://lookberry.uz'),
  title: 'LOOKBERRY — Premium meva, shokolad va gift boxlar',
  description: 'Lookberry — qulupnay, meva, premium shokolad va kruassanlardan tayyorlangan maxsus gift boxlar. Buyurtmani sayt orqali tanlang va Telegram orqali yuboring.',
  keywords: ['Lookberry', 'qulupnay box', 'premium shokolad', 'gift box', 'Toshkent dessert', 'kruassan', 'Uzbekistan'],
  openGraph: {
    title: 'LOOKBERRY — Premium meva, shokolad va gift boxlar',
    description: 'Qulupnay, meva, premium shokolad va kruassanlardan tayyorlangan maxsus gift boxlar.',
    url: 'https://lookberry.uz',
    siteName: 'LOOKBERRY',
    images: [
      {
        url: '/products/assorti-mix-85.jpg',
        width: 1200,
        height: 900,
        alt: 'LOOKBERRY premium gift box'
      }
    ],
    locale: 'uz_UZ',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LOOKBERRY — Premium gift boxlar',
    description: 'Premium meva, shokolad va kruassan boxlar.',
    images: ['/products/assorti-mix-85.jpg']
  },
  alternates: {
    canonical: '/'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#fff7ea'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
