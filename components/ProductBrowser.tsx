'use client';

import { useMemo, useState } from 'react';
import type { CategoryId, Product, SortId } from '@/types/lookberry';
import { categories, filterTabs } from '@/lib/categories';
import { ProductCard } from './ProductCard';
import { classNames } from '@/lib/format';

const sortOptions: Array<{ id: SortId; label: string }> = [
  { id: 'popular', label: 'Mashhur' },
  { id: 'cheap', label: 'Arzon' },
  { id: 'expensive', label: 'Qimmat' },
  { id: 'new', label: 'Yangi' }
];

export function ProductBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId>('all');
  const [sort, setSort] = useState<SortId>('popular');

  const filteredProducts = useMemo(() => {
    const needle = query.toLowerCase().trim();
    const filtered = products.filter((product) => {
      const categoryMatch =
        category === 'all' ||
        (category === 'bestseller' ? product.popular : product.category === category) ||
        product.tags.includes(category);
      const searchMatch =
        !needle ||
        [product.name, product.shortIngredients, product.description, product.category, ...product.ingredients, ...product.tags]
          .join(' ')
          .toLowerCase()
          .includes(needle);
      return categoryMatch && searchMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'cheap') return a.price - b.price;
      if (sort === 'expensive') return b.price - a.price;
      if (sort === 'new') return Number(b.isNew) - Number(a.isNew);
      return Number(b.popular) - Number(a.popular) || a.price - b.price;
    });
  }, [products, query, category, sort]);

  return (
    <>
      <section id="categories" className="section-pad relative overflow-hidden">
        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="container-premium">
          <div className="section-heading">
            <p className="eyebrow">Kategoriyalar</p>
            <h2>Qaysi ta'm sizniki?</h2>
            <p>Har bir kategoriya o'z kayfiyati, sovg'a sababi va premium taqdimotiga ega.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((item) => (
              <button key={item.id} onClick={() => { setCategory(item.id); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }} className={classNames('group relative min-h-60 overflow-hidden rounded-[2rem] border p-5 text-left shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-premium', category === item.id ? 'border-strawberry bg-strawberry/10' : 'border-white/70 bg-white/55')}>
                <img src={item.image} alt={`${item.label} kategoriyasi`} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-110 group-hover:opacity-70" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/75 via-chocolate/15 to-white/20" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/85 text-3xl shadow-soft backdrop-blur">{item.emoji}</span>
                  <div>
                    <h3 className="font-serif text-3xl text-white">{item.label}</h3>
                    <p className="mt-2 max-w-xs text-sm text-white/80">{item.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="section-pad relative overflow-hidden bg-white/35">
        <div className="absolute left-[-8rem] top-10 h-80 w-80 rounded-full bg-strawberry/10 blur-3xl" />
        <div className="container-premium">
          <div className="section-heading">
            <p className="eyebrow">Premium catalog</p>
            <h2>Bizning shirinliklarimiz</h2>
            <p>Har bir box — mehr bilan tayyorlangan.</p>
          </div>

          <div className="mb-8 rounded-[2rem] border border-white/70 bg-cream/70 p-4 shadow-soft backdrop-blur-xl md:p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative block">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg">🔎</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="qulupnay, banan, shokolad, kruassan, oreo, assorti..." className="w-full rounded-full border border-chocolate/10 bg-white px-12 py-4 text-chocolate outline-none transition placeholder:text-chocolate/35 focus:border-strawberry focus:ring-4 focus:ring-strawberry/10" />
              </label>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortId)} className="rounded-full border border-chocolate/10 bg-white px-5 py-4 font-semibold text-chocolate outline-none focus:border-strawberry focus:ring-4 focus:ring-strawberry/10">
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {filterTabs.map((tab) => (
                <button key={tab.id} onClick={() => setCategory(tab.id)} className={classNames('rounded-full px-4 py-2 text-sm font-bold transition', category === tab.id ? 'bg-chocolate text-white shadow-soft' : 'bg-white text-chocolate/65 hover:bg-gold/20 hover:text-chocolate')}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProducts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/70 bg-white/70 p-10 text-center shadow-soft">
              <div className="text-5xl">🍓</div>
              <h3 className="mt-4 font-serif text-3xl text-chocolate">Natija topilmadi</h3>
              <p className="mt-2 text-chocolate/60">Boshqa so'z yoki kategoriya bilan qidirib ko'ring.</p>
              <button onClick={() => { setQuery(''); setCategory('all'); }} className="btn-primary mt-6">Barchasini ko'rsatish</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
