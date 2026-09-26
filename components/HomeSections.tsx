import Link from 'next/link';
import type { Product, SiteSettings } from '@/types/lookberry';
import { formatPrice } from '@/lib/format';

export function PremiumStory({ products }: { products: Product[] }) {
  const main = products.find((product) => product.id === 'qulupnay-box') || products[0];
  const side = products.find((product) => product.id === 'qulupnay-shokolad-mix') || products[1] || main;

  return (
    <section id="story" className="section-pad relative overflow-hidden">
      <div className="container-premium grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[540px]">
          <div className="absolute inset-8 rounded-[3rem] bg-chocolate shadow-premium" />
          <img src={main?.image} alt="Lookberry premium qulupnay box" className="absolute left-0 top-0 h-[70%] w-[72%] rounded-[3rem] object-cover shadow-premium" loading="lazy" />
          <img src={side?.image} alt="Lookberry shokolad mix" className="absolute bottom-0 right-0 h-[55%] w-[58%] rounded-[2.5rem] border-[10px] border-cream object-cover shadow-premium" loading="lazy" />
          <div className="absolute bottom-16 left-6 rounded-[1.5rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-md">
            <p className="eyebrow">made with love</p>
            <strong className="font-serif text-3xl text-chocolate">{main ? formatPrice(main.price) : '70 000 SO\'M'}</strong>
          </div>
        </div>
        <div>
          <p className="eyebrow">Lookberry story</p>
          <h2 className="font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[.95] tracking-[-.04em] text-chocolate">Har bir box — kichik bir baxt.</h2>
          <p className="mt-6 text-lg leading-8 text-chocolate/70">
            Lookberry oddiy shirinlik emas. Biz yaqin insoningizga beriladigan hissiyot va chiroyli lahzani yaratamiz.
          </p>
          <p className="mt-4 text-chocolate/65">
            Har bir qulupnay, kruassan va shokolad detaligacha tanlanadi. Qadoqlash sovg'a sifatida ko'rinishi, suratga chiroyli tushishi va ochilganda tabassum uyg'otishi uchun yaratiladi.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Premium ingredientlar', 'Instagram-worthy', 'Mehr bilan tayyorlanadi'].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/70 bg-white/55 p-5 shadow-soft">
                <span className="text-2xl">✦</span>
                <p className="mt-3 font-semibold text-chocolate">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Occasions() {
  const occasions = [
    ['❤️', 'Sevgi uchun', '/products/qulupnay-box.jpg'],
    ['🎂', "Tug'ilgan kun", '/products/assorti-mix-85.jpg'],
    ['🎁', "Sovg'a uchun", '/products/assorti-mix-80.jpg'],
    ['🌹', 'Uchrashuv', '/products/qulupnay-shokolad-standard.jpg'],
    ['💍', 'Maxsus kun', '/products/qulupnay-shokolad-mix.jpg'],
    ['✨', 'Shunchaki xursand qilish uchun', '/products/kruassan-mix.jpg']
  ];

  return (
    <section className="section-pad bg-chocolate text-white">
      <div className="container-premium">
        <div className="section-heading text-white">
          <p className="eyebrow text-gold">Occasions</p>
          <h2>Qaysi kun uchun?</h2>
          <p className="text-white/65">Lookberry sovg'asi oddiy kunni ham unutilmas lahzaga aylantiradi.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map(([emoji, title, image]) => (
            <Link href="/#products" key={title} className="group relative min-h-64 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.06] p-5 shadow-soft transition hover:-translate-y-1 hover:border-gold/40">
              <img src={image} alt={`${title} uchun Lookberry`} className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-700 group-hover:scale-110 group-hover:opacity-55" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate via-chocolate/40 to-transparent" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-3xl shadow-soft">{emoji}</span>
                <h3 className="font-serif text-3xl">{title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyLookberry() {
  const items = [
    ['🍓', 'Yangi mahsulotlar', 'Har bir buyurtma uchun mevalar ehtiyotkorlik bilan tanlanadi.'],
    ['🍫', 'Premium shokolad', 'Italyan shokoladi va nozik dekor bilan boy taʼm.'],
    ['🎁', 'Chiroyli qadoqlash', 'Sovgʼa qilishga tayyor premium box koʼrinishi.'],
    ['❤️', 'Mehr bilan tayyorlanadi', 'Har bir detal iliq hissiyot va eʼtibor bilan.'],
    ['🚚', 'Yetkazib berish', 'Toshkent boʼylab qulay yetkazib berish.'],
    ['⭐', 'Premium xizmat', 'Buyurtma bosqichlari aniq, tez va ishonchli.']
  ];

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="container-premium">
        <div className="section-heading">
          <p className="eyebrow">Why Lookberry</p>
          <h2>Nima uchun Lookberry?</h2>
          <p>Luxury, delicious, romantic va ishonchli sovg'a tajribasi.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(([emoji, title, text]) => (
            <div key={title} className="rounded-[2rem] border border-white/70 bg-white/60 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-premium">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-cream text-3xl shadow-inner shadow-gold/20">{emoji}</span>
              <h3 className="mt-6 font-serif text-3xl text-chocolate">{title}</h3>
              <p className="mt-3 leading-7 text-chocolate/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InstagramGallery({ products }: { products: Product[] }) {
  const gallery = products.slice(0, 8);
  return (
    <section id="contact" className="section-pad bg-white/35">
      <div className="container-premium">
        <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div className="section-heading mx-0 text-left">
            <p className="eyebrow">Instagram</p>
            <h2>Bizni Instagram'da kuzating</h2>
            <p>@lookberry_uz — yangi boxlar, sovg'a g'oyalari va real buyurtmalar ilhomi.</p>
          </div>
          <a href="https://www.instagram.com/lookberry_uz" target="_blank" rel="noreferrer" className="btn-primary mb-8 justify-center">Instagram'ga o'tish</a>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {gallery.map((product, index) => (
            <a href="https://www.instagram.com/lookberry_uz" target="_blank" rel="noreferrer" key={product.id} className={`group overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 p-2 shadow-soft ${index % 3 === 0 ? 'md:row-span-2' : ''}`}>
              <img src={product.image} alt={`${product.name} Instagram gallery`} className={`w-full rounded-[1.5rem] object-cover transition duration-700 group-hover:scale-110 ${index % 3 === 0 ? 'h-full min-h-72' : 'aspect-square'}`} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DeliverySection({ settings }: { settings: SiteSettings }) {
  const cards = [
    ['🚚', 'Yetkazib berish', `${settings.city} bo'ylab ${formatPrice(settings.deliveryFee).toLowerCase()} dan.`],
    ['🎁', 'Premium qadoqlash', 'Sovgʼa sifatida topshirishga tayyor nafis koʼrinish.'],
    ['⚡', 'Tezkor buyurtma', 'Mahsulot → info → tasdiqlash → Telegram.'],
    ['📍', settings.city, settings.deliveryNote]
  ];

  return (
    <section id="delivery" className="section-pad relative overflow-hidden">
      <div className="container-premium overflow-hidden rounded-[3rem] bg-chocolate p-6 text-white shadow-premium md:p-10 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-gold">Delivery</p>
            <h2 className="font-serif text-[clamp(2.8rem,6vw,5.8rem)] leading-[.95] tracking-[-.04em]">Sevgingizni biz yetkazamiz ❤️</h2>
            <p className="mt-5 text-lg leading-8 text-white/65">Buyurtma sayt orqali yig'iladi va Lookberry jamoasiga Telegram orqali to'liq yuboriladi.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map(([emoji, title, text]) => (
              <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[.06] p-6 shadow-soft">
                <span className="text-4xl">{emoji}</span>
                <h3 className="mt-5 font-serif text-3xl">{title}</h3>
                <p className="mt-2 text-white/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-chocolate/10 bg-cream py-10">
      <div className="container-premium flex flex-col gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <Link href="/#home" className="font-serif text-3xl tracking-[.16em] text-chocolate">LOOKBERRY</Link>
          <p className="mt-2 text-sm text-chocolate/55">Premium meva, shokolad va gift boxlar.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-chocolate/65">
          <a href="https://www.instagram.com/lookberry_uz" target="_blank" rel="noreferrer" className="hover:text-strawberry">Instagram @lookberry_uz</a>
          <span>•</span>
          <span>Telegram @lookberrys</span>
          <span>•</span>
          <Link href="/admin" className="hover:text-strawberry">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
