'use client';

import Link from 'next/link';
import type { Product } from '@/types/lookberry';
import { useCart } from './CartProvider';

export function Hero({ products }: { products: Product[] }) {
  const { buyNow } = useCart();
  const heroProduct = products.find((product) => product.id === 'assorti-mix-85') || products[0];
  const secondary = products.find((product) => product.id === 'kruassan-mix') || products[1];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden pb-16 pt-32 md:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(196,30,58,.16),transparent_30%),radial-gradient(circle_at_84%_16%,rgba(211,166,74,.18),transparent_28%),linear-gradient(135deg,#fff9ef_0%,#f7ead7_46%,#fff8f1_100%)]" />
      <div className="absolute left-8 top-36 hidden rounded-full bg-white/40 px-5 py-3 text-4xl shadow-soft backdrop-blur-md float-slow md:block">🍓</div>
      <div className="absolute right-[10%] top-28 hidden rotate-12 rounded-full bg-chocolate px-5 py-3 text-3xl text-white shadow-premium float-slower md:block">🍫</div>
      <div className="absolute bottom-20 left-[8%] hidden -rotate-6 rounded-full bg-gold/80 px-5 py-3 text-3xl shadow-soft float-slow lg:block">🥐</div>

      <div className="container-premium relative z-10 grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <div className="text-center lg:text-left">
          <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-white/55 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-chocolate shadow-soft backdrop-blur-md lg:mx-0">
            <span className="h-2 w-2 rounded-full bg-strawberry shadow-[0_0_20px_rgba(196,30,58,.8)]" /> PREMIUM GIFT BOX
          </div>
          <h1 className="font-serif text-[clamp(3rem,8vw,7.8rem)] font-semibold leading-[.9] tracking-[-.06em] text-chocolate">
            Shirin lahzalar <span className="text-strawberry">Lookberry</span> bilan ❤️
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-chocolate/70 md:text-xl lg:mx-0">
            Yangi mevalar, premium shokolad va kruassanlardan tayyorlangan maxsus boxlar.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Link href="/#products" className="btn-primary justify-center">MAHSULOTLARNI KO'RISH</Link>
            <button onClick={() => heroProduct && buyNow(heroProduct)} className="btn-secondary justify-center">BUYURTMA BERISH</button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 rounded-[1.75rem] border border-white/70 bg-white/45 p-3 shadow-soft backdrop-blur-md sm:max-w-xl lg:max-w-none">
            {[
              ['10+', 'Premium box'],
              ['15 min', 'Tez tanlash'],
              ['@lookberry_uz', 'Instagram']
            ].map(([value, label]) => (
              <div key={value} className="rounded-[1.25rem] bg-white/65 p-4 text-center">
                <strong className="block font-serif text-2xl text-chocolate">{value}</strong>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-[.16em] text-chocolate/45">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[520px] lg:min-h-[700px]">
          <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
          {heroProduct && (
            <div className="absolute left-0 top-6 w-[82%] overflow-hidden rounded-[3rem] border border-white/70 bg-white/45 p-3 shadow-premium backdrop-blur-md md:w-[78%]">
              <img src={heroProduct.image} alt="Lookberry assorti mix premium box" className="aspect-[4/3] w-full rounded-[2.4rem] object-cover" />
              <div className="absolute bottom-7 left-7 rounded-2xl bg-white/80 px-5 py-3 shadow-soft backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-chocolate/55">Bestseller</p>
                <p className="font-serif text-2xl text-chocolate">{heroProduct.name}</p>
              </div>
            </div>
          )}
          {secondary && (
            <div className="absolute bottom-3 right-0 w-[56%] overflow-hidden rounded-[2.5rem] border border-white/80 bg-cream/65 p-3 shadow-premium backdrop-blur-md">
              <img src={secondary.image} alt="Lookberry kruassan mix premium box" className="aspect-square w-full rounded-[2rem] object-cover" />
            </div>
          )}
          <div className="absolute right-2 top-6 rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-soft backdrop-blur-md md:right-8 md:top-20">
            <p className="text-sm font-bold text-chocolate">Yangi tayyorlanadi</p>
            <p className="text-xs text-chocolate/55">🍓 🍫 🥐 🍌</p>
          </div>
        </div>
      </div>
    </section>
  );
}
