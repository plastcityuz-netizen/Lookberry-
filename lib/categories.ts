import type { CategoryId } from '@/types/lookberry';

export const categories: Array<{
  id: CategoryId;
  label: string;
  emoji: string;
  description: string;
  image: string;
}> = [
  {
    id: 'qulupnay',
    label: 'Qulupnay Box',
    emoji: '🍓',
    description: 'Yangi qulupnay va italyan shokoladi',
    image: '/products/qulupnay-box.jpg'
  },
  {
    id: 'shokolad',
    label: 'Shokolad',
    emoji: '🍫',
    description: 'Boy shokoladli premium taʼmlar',
    image: '/products/amerikanskiy-shokolad.jpg'
  },
  {
    id: 'kruassan',
    label: 'Kruassan',
    emoji: '🥐',
    description: 'Yumshoq kruassan boxlar',
    image: '/products/kruassan-mix.jpg'
  },
  {
    id: 'mevali',
    label: 'Mevali Box',
    emoji: '🍌',
    description: 'Banan, kivi, mandarin va berrylar',
    image: '/products/assorti-mix-85.jpg'
  },
  {
    id: 'gift',
    label: 'Gift Box',
    emoji: '🎁',
    description: 'Sovgʼa uchun premium qadoqlash',
    image: '/products/assorti-mix-80.jpg'
  },
  {
    id: 'bestseller',
    label: 'Bestseller',
    emoji: '⭐',
    description: 'Eng koʼp tanlangan Lookberrylar',
    image: '/products/qulupnay-shokolad-mix.jpg'
  }
];

export const filterTabs: Array<{ id: CategoryId; label: string }> = [
  { id: 'all', label: 'Barchasi' },
  { id: 'qulupnay', label: 'Qulupnay' },
  { id: 'shokolad', label: 'Shokolad' },
  { id: 'kruassan', label: 'Kruassan' },
  { id: 'mevali', label: 'Mevali Box' },
  { id: 'gift', label: 'Gift Box' }
];
