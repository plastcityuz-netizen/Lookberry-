import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin';
import { formatPrice } from '@/lib/format';
import { sendTelegramOrder } from '@/lib/telegram';
import { getOrders, getProducts, getSettings, saveOrder } from '@/lib/store';
import type { DeliveryType, OrderProductInput, OrderRecord } from '@/types/lookberry';

export const runtime = 'nodejs';

type OrderInput = {
  name?: string;
  phone?: string;
  products?: OrderProductInput[];
  delivery?: DeliveryType;
  address?: string;
  day?: string;
  time?: string;
  comment?: string;
  total?: number;
};

function makeOrderId() {
  return `LB-${Math.floor(1000 + Math.random() * 9000)}${Date.now().toString().slice(-2)}`;
}

function cleanPhone(phone: string) {
  return phone.replace(/\s+/g, ' ').trim();
}

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return fail('Admin ruxsati kerak.', 401);
  }

  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  let body: OrderInput;
  try {
    body = (await request.json()) as OrderInput;
  } catch {
    return fail('Buyurtma ma\'lumotlari noto\'g\'ri.');
  }

  const name = String(body.name || '').trim();
  const phone = cleanPhone(String(body.phone || ''));
  const delivery = body.delivery === 'pickup' ? 'pickup' : 'delivery';
  const address = String(body.address || '').trim();
  const day = String(body.day || 'Bugun').trim();
  const time = String(body.time || '').trim();
  const comment = String(body.comment || '').trim();
  const items = Array.isArray(body.products) ? body.products : [];

  if (name.length < 2) return fail('Ismingizni kiriting.');
  if (!/^\+?998[\s\d]{9,}$/.test(phone.replace(/-/g, ''))) return fail('Telefon raqamingizni to\'liq kiriting.');
  if (!items.length) return fail('Kamida bitta mahsulot tanlang.');
  if (delivery === 'delivery' && address.length < 5) return fail('Yetkazib berish manzilini kiriting.');
  if (!time) return fail('Yetkazib berish vaqtini tanlang.');

  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const productMap = new Map(products.filter((product) => product.available).map((product) => [product.id, product]));

  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);
    const quantity = Math.max(1, Math.min(30, Number(item.quantity || 1)));
    if (!product) throw new Error('Tanlangan mahsulot topilmadi.');
    return {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      lineTotal: product.price * quantity
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = delivery === 'delivery' ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  if (typeof body.total === 'number' && Math.abs(body.total - total) > 1) {
    return fail(`Jami summa yangilandi: ${formatPrice(total)}. Iltimos, qayta tasdiqlang.`);
  }

  const order: OrderRecord = {
    id: makeOrderId(),
    createdAt: new Date().toISOString(),
    customer: {
      name,
      phone,
      address: delivery === 'delivery' ? address : undefined
    },
    delivery,
    deliveryLabel: delivery === 'delivery' ? 'Yetkazib berish' : 'Olib ketish',
    day,
    time,
    comment,
    products: orderItems,
    subtotal,
    deliveryFee,
    total,
    status: 'Yangi'
  };

  try {
    await sendTelegramOrder(order);
    await saveOrder(order);
    return NextResponse.json({ ok: true, orderId: order.id, order });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Buyurtmani yuborishda xatolik yuz berdi.',
        details: error instanceof Error ? error.message : 'Telegram xatosi'
      },
      { status: 502 }
    );
  }
}
