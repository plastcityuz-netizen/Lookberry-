'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { classNames } from '@/lib/format';

const nav = [
  ['Bosh sahifa', '/#home'],
  ['Mahsulotlar', '/#products'],
  ['Kategoriyalar', '/#categories'],
  ['Biz haqimizda', '/#story'],
  ['Yetkazib berish', '/#delivery'],
  ['Aloqa', '/#contact']
];

export function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <div className={classNames('mx-auto max-w-7xl rounded-full border px-4 py-3 transition-all duration-500 md:px-5', scrolled ? 'border-white/70 bg-cream/70 shadow-premium backdrop-blur-xl' : 'border-white/45 bg-white/35 shadow-soft backdrop-blur-md')}>
        <div className="flex items-center justify-between gap-4">
          <Link href="/#home" className="group flex items-center gap-3" aria-label="LOOKBERRY bosh sahifa">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-chocolate text-lg text-white shadow-soft transition group-hover:scale-105">🍓</span>
            <span className="font-serif text-2xl font-semibold tracking-[.12em] text-chocolate md:text-3xl">LOOKBERRY</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-white/40 p-1 lg:flex">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full px-4 py-2 text-sm font-medium text-chocolate/75 transition hover:bg-white hover:text-strawberry">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/#products" className="hidden h-11 w-11 place-items-center rounded-full bg-white text-lg shadow-soft transition hover:-translate-y-0.5 hover:bg-strawberry hover:text-white sm:grid" aria-label="Sevimlilar">❤️</Link>
            <button onClick={openCart} className="relative grid h-11 w-11 place-items-center rounded-full bg-chocolate text-lg text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-strawberry" aria-label="Savatni ochish">
              🛒
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-black text-chocolate">{count}</span>
            </button>
            <button onClick={() => setMenuOpen((open) => !open)} className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl text-chocolate shadow-soft lg:hidden" aria-label="Menyuni ochish">
              {menuOpen ? '×' : '☰'}
            </button>
          </div>
        </div>
      </div>

      <div className={classNames('mx-auto mt-2 max-w-7xl overflow-hidden rounded-[1.5rem] border border-white/70 bg-cream/90 shadow-premium backdrop-blur-xl transition-all lg:hidden', menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0')}>
        <nav className="grid p-3">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3 font-medium text-chocolate transition hover:bg-white hover:text-strawberry">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
