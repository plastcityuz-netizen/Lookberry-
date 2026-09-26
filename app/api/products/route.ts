import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin';
import { deleteProduct, getProducts, upsertProduct } from '@/lib/store';
import type { Product } from '@/types/lookberry';

export const runtime = 'nodejs';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['ʼ`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `product-${Date.now()}`;
}

function normalizeProduct(input: Partial<Product>): Product {
  const name = String(input.name || '').trim();
  const price = Number(input.price || 0);
  const category = input.category || 'gift';
  if (!name) throw new Error('Mahsulot nomi kerak.');
  if (!Number.isFinite(price) || price <= 0) throw new Error('Narx noto\'g\'ri.');

  const id = input.id || slugify(`${name}-${Date.now()}`);
  const slug = input.slug ? slugify(input.slug) : slugify(name + '-' + id.slice(-4));
  const ingredients = Array.isArray(input.ingredients)
    ? input.ingredients.map((item) => String(item).trim()).filter(Boolean)
    : [];

  return {
    id,
    slug,
    name,
    price,
    image: input.image || '/products/qulupnay-box.jpg',
    shortIngredients: input.shortIngredients || ingredients.join(', ') || 'Premium Lookberry box',
    ingredients,
    description: input.description || 'Lookberry premium desert box.',
    category,
    tags: Array.isArray(input.tags) ? input.tags.map((item) => String(item).trim()).filter(Boolean) : [],
    badge: input.badge || 'Premium',
    popular: Boolean(input.popular),
    isNew: Boolean(input.isNew),
    available: input.available !== false
  } as Product;
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Admin ruxsati kerak.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<Product>;
    const product = normalizeProduct(body);
    await upsertProduct(product);
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Mahsulot saqlanmadi.' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Admin ruxsati kerak.' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<Product>;
    const product = normalizeProduct(body);
    await upsertProduct(product);
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Mahsulot yangilanmadi.' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Admin ruxsati kerak.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID kerak.' }, { status: 400 });
  const deleted = await deleteProduct(id);
  return NextResponse.json({ deleted });
}
