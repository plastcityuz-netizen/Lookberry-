import { Hero } from '@/components/Hero';
import { ProductBrowser } from '@/components/ProductBrowser';
import { DeliverySection, Footer, InstagramGallery, Occasions, PremiumStory, WhyLookberry } from '@/components/HomeSections';
import { getProducts, getSettings } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const availableProducts = products.filter((product) => product.available);

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'LOOKBERRY',
    description: 'Premium meva, shokolad va gift boxlar.',
    url: 'https://lookberry.uz',
    areaServed: 'Uzbekistan',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UZ',
      addressLocality: settings.city
    },
    sameAs: ['https://www.instagram.com/lookberry_uz']
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: availableProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: { '@type': 'Brand', name: 'LOOKBERRY' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'UZS',
          price: product.price,
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <Hero products={availableProducts} />
      <ProductBrowser products={availableProducts} />
      <PremiumStory products={availableProducts} />
      <Occasions />
      <WhyLookberry />
      <InstagramGallery products={availableProducts} />
      <DeliverySection settings={settings} />
      <Footer />
    </main>
  );
}
