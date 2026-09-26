'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types/lookberry';
import { formatPrice } from '@/lib/format';
import { useCart } from './CartProvider';
import { ProductCard } from './ProductCard';

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart, buyNow, toggleFavorite, isFavorite } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const favorite = isFavorite(product.id);

  const inc = () => setQuantity((q) => Math.min(30, q + 1));
  const dec = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <main className="min-h-screen pt-28">
      <section className="relative overflow-hidden pb-16 pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(211,166,74,.2),transparent_32%),linear-gradient(135deg,#fff9ef,#f7ead7)]" />
        <div className="container-premium relative z-10">
          <Link href="/#products" className="mb-7 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-chocolate shadow-soft transition hover:text-strawberry">← Mahsulotlarga qaytish</Link>
          <div className="grid gap-9 lg:grid-cols-[1.08fr_.92fr] lg:items-start">
            <div className="group relative overflow-hidden rounded-[3rem] border border-white/70 bg-white/50 p-3 shadow-premium">
              <button onClick={() => setZoomed(true)} className="absolute right-6 top-6 z-10 rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-chocolate shadow-soft backdrop-blur transition hover:bg-chocolate hover:text-white">🔍 Zoom</button>
              <img src={product.image} alt={`${product.name} katta rasmi`} className="aspect-[4/3] w-full rounded-[2.4rem] object-cover transition duration-700 group-hover:scale-[1.04]" />
            </div>

            <div className="rounded-[3rem] border border-white/70 bg-white/65 p-6 shadow-premium backdrop-blur-xl md:p-8">
              <p className="eyebrow">{product.badge || 'Premium box'}</p>
              <h1 className="mt-3 font-serif text-[clamp(2.8rem,6vw,5.6rem)] uppercase leading-[.9] tracking-[-.05em] text-chocolate">{product.name}</h1>
              <p className="mt-5 font-serif text-4xl text-strawberry">{formatPrice(product.price)}</p>
              <p className="mt-5 text-lg leading-8 text-chocolate/70">{product.description}</p>

              <div className="mt-7 rounded-[2rem] bg-cream/80 p-5 shadow-inner shadow-gold/10">
                <h2 className="font-serif text-2xl text-chocolate">Ingredients:</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient) => (
                    <span key={ingredient} className="rounded-full border border-gold/25 bg-white px-4 py-2 text-sm font-semibold text-chocolate/70">{ingredientIcon(ingredient)} {ingredient}</span>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <span className="font-bold uppercase tracking-[.16em] text-chocolate/55">Quantity:</span>
                <div className="inline-flex items-center rounded-full border border-chocolate/10 bg-white p-1 shadow-soft">
                  <button onClick={dec} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-2xl text-chocolate transition hover:bg-strawberry hover:text-white" aria-label="Kamaytirish">−</button>
                  <span className="min-w-14 text-center text-lg font-bold text-chocolate">{quantity}</span>
                  <button onClick={inc} className="grid h-11 w-11 place-items-center rounded-full bg-chocolate text-2xl text-white transition hover:bg-strawberry" aria-label="Ko'paytirish">+</button>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button onClick={() => buyNow(product, quantity)} disabled={!product.available} className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50">BUYURTMA BERISH</button>
                <button onClick={() => addToCart(product, quantity)} disabled={!product.available} className="btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-50">SAVATGA QO'SHISH</button>
              </div>
              <button onClick={() => toggleFavorite(product.id)} className="mt-4 rounded-full bg-white px-5 py-3 font-bold text-chocolate shadow-soft transition hover:text-strawberry">
                {favorite ? '💖 Sevimlilarda' : '❤️ Sevimlilarga'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/35">
        <div className="container-premium">
          <div className="section-heading">
            <p className="eyebrow">You may love</p>
            <h2>O'xshash shirinliklar</h2>
            <p>Yaqin insoningiz uchun yana bir nozik Lookberry sovg'asi.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </div>
      </section>

      {zoomed && (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-chocolate/85 p-4 backdrop-blur-md" onClick={() => setZoomed(false)}>
          <button className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-white text-2xl text-chocolate shadow-soft" aria-label="Zoom yopish">×</button>
          <img src={product.image} alt={`${product.name} zoom`} className="max-h-[88vh] max-w-[96vw] rounded-[2rem] object-contain shadow-premium" />
        </div>
      )}
    </main>
  );
}

function ingredientIcon(value: string) {
  const text = value.toLowerCase();
  if (text.includes('qulupnay')) return '🍓';
  if (text.includes('shokolad')) return '🍫';
  if (text.includes('kruassan')) return '🥐';
  if (text.includes('banan')) return '🍌';
  if (text.includes('kivi')) return '🥝';
  if (text.includes('mandarin')) return '🍊';
  return '✦';
}
