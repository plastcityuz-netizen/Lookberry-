import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-4 text-center">
      <div className="max-w-xl rounded-[2rem] border border-white/70 bg-white/70 p-10 shadow-premium">
        <div className="text-6xl">🍓</div>
        <h1 className="mt-5 font-serif text-5xl text-chocolate">Sahifa topilmadi</h1>
        <p className="mt-3 text-chocolate/60">Lookberry catalogiga qaytib, premium sovg'a tanlang.</p>
        <Link href="/" className="btn-primary mt-7">Bosh sahifaga qaytish</Link>
      </div>
    </main>
  );
}
