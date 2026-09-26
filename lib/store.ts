import { promises as fs } from 'fs';
import path from 'path';
import type { OrderRecord, OrderStatus, Product, SiteSettings } from '@/types/lookberry';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const productsPath = path.join(dataDir, 'products.json');
const ordersPath = path.join(dataDir, 'orders.json');
const settingsPath = path.join(dataDir, 'settings.json');

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === 'ENOENT') {
      await ensureDataDir();
      await writeJson(filePath, fallback);
      return fallback;
    }
    throw error;
  }
}

async function writeJson<T>(filePath: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getProducts(): Promise<Product[]> {
  const products = await readJson<Product[]>(productsPath, []);
  return products;
}

export async function getAvailableProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.available);
}

export async function saveProducts(products: Product[]) {
  await writeJson(productsPath, products);
}

export async function upsertProduct(product: Product) {
  const products = await getProducts();
  const existing = products.findIndex((item) => item.id === product.id);
  if (existing >= 0) {
    products[existing] = product;
  } else {
    products.unshift(product);
  }
  await saveProducts(products);
  return product;
}

export async function deleteProduct(id: string) {
  const products = await getProducts();
  const next = products.filter((product) => product.id !== id);
  await saveProducts(next);
  return next.length !== products.length;
}

export async function getOrders(): Promise<OrderRecord[]> {
  const orders = await readJson<OrderRecord[]>(ordersPath, []);
  return orders;
}

export async function saveOrder(order: OrderRecord) {
  const orders = await getOrders();
  orders.unshift(order);
  await writeJson(ordersPath, orders);
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = await getOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return null;
  orders[index].status = status;
  await writeJson(ordersPath, orders);
  return orders[index];
}

export async function getSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    deliveryFee: Number(process.env.DELIVERY_FEE_UZS || 15000),
    city: 'Toshkent',
    deliveryNote: "Toshkent bo'ylab premium qadoqlash bilan yetkazib berish.",
    orderStartHour: '10:00',
    orderEndHour: '22:00'
  };
  return readJson<SiteSettings>(settingsPath, defaults);
}

export async function saveSettings(settings: SiteSettings) {
  await writeJson(settingsPath, settings);
  return settings;
}
