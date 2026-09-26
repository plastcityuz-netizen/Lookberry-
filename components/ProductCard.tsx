'use client';

import Link from 'next/link';
import type { Product } from '@/types/lookberry';
import { formatPrice } from '@/lib/format';
import { useCart } from './CartProvider';

export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { addToCart, buyNow, toggleFavorite, isFavorite } = useCart();
  const favorite = isFavorite(product.id);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/65 shadow-soft transition duration-500 hover:-translate-y-2 hover:shadow-premium">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-white via-cream to-roseSoft">
        <div className="absolute left-4 top-4 z-10 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-black uppercase tracking-[.16em] text-chocolate shadow-soft backdrop-blur-md">{product.badge || 'Premium'}</div>
        <button type="button" onClick={(event) => { event.preventDefault(); toggleFavorite(product.id); }} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/75 text-lg shadow-soft backdrop-blur-md transition hover:scale-110" aria-label="Sevimlilarga qo'shish">
          {favorite ? '💖' : '❤️'}
        </button>
        <img src={product.image} alt={`${product.name} Lookberry premium box`} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
      </Link>
      <div className="space-y-4 p-5 md:p-6">
        <div>
          <Link href={`/products/${product.slug}`} className="font-serif text-2xl uppercase leading-tight text-chocolate transition hover:text-strawberry md:text-3xl">
            {product.name}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-chocolate/60">{product.shortIngredients}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <strong className="font-serif text-2xl text-strawberry">{formatPrice(product.price)}</strong>
          {!product.available && <span className="rounded-full bg-chocolate/10 px-3 py-1 text-xs font-bold text-chocolate/50">Mavjud emas</span>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <button disabled={!product.available} onClick={() => buyNow(product)} className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-50">HOZIROQ BUYURTMA BERISH</button>
          <button disabled={!product.available} onClick={() => addToCart(product)} className="btn-secondary justify-center disabled:cursor-not-allowed disabled:opacity-50">SAVATGA</button>
        </div>
      </div>
    </article>
  );
}
