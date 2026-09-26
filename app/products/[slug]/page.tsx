import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { getProducts } from '@/lib/store';
import { formatPrice } from '@/lib/format';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);
  if (!product) return { title: 'Mahsulot topilmadi — LOOKBERRY' };

  return {
    title: `${product.name} — ${formatPrice(product.price)} | LOOKBERRY`,
    description: product.description,
    openGraph: {
      title: `${product.name} — LOOKBERRY`,
      description: product.description,
      images: [{ url: product.image, alt: product.name }]
    }
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug && item.available);
  if (!product) notFound();

  const related = products
    .filter((item) => item.id !== product.id && item.available && (item.category === product.category || item.popular))
    .slice(0, 3);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: { '@type': 'Brand', name: 'LOOKBERRY' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UZS',
      price: product.price,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
