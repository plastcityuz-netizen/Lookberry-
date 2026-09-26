import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin';
import { updateOrderStatus } from '@/lib/store';
import type { OrderStatus } from '@/types/lookberry';

export const runtime = 'nodejs';

const statuses: OrderStatus[] = ['Yangi', 'Qabul qilindi', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Yetkazildi', 'Bekor qilindi'];

type Params = Promise<{ id: string }>;

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Admin ruxsati kerak.' }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: OrderStatus } | null;
  if (!body?.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: 'Status noto\'g\'ri.' }, { status: 400 });
  }

  const order = await updateOrderStatus(id, body.status);
  if (!order) return NextResponse.json({ error: 'Buyurtma topilmadi.' }, { status: 404 });
  return NextResponse.json({ order });
}
