import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin';
import { getSettings, saveSettings } from '@/lib/store';
import type { SiteSettings } from '@/types/lookberry';

export const runtime = 'nodejs';

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: 'Admin ruxsati kerak.' }, { status: 401 });
  }

  try {
    const current = await getSettings();
    const input = (await request.json()) as Partial<SiteSettings>;
    const settings: SiteSettings = {
      deliveryFee: Math.max(0, Number(input.deliveryFee ?? current.deliveryFee)),
      city: String(input.city ?? current.city).trim() || current.city,
      deliveryNote: String(input.deliveryNote ?? current.deliveryNote).trim() || current.deliveryNote,
      orderStartHour: String(input.orderStartHour ?? current.orderStartHour).trim() || current.orderStartHour,
      orderEndHour: String(input.orderEndHour ?? current.orderEndHour).trim() || current.orderEndHour
    };
    await saveSettings(settings);
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: 'Sozlamalar saqlanmadi.' }, { status: 400 });
  }
}
