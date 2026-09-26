import type { OrderRecord } from '@/types/lookberry';
import { formatPrice } from './format';

function deliveryLabel(delivery: OrderRecord['delivery']) {
  return delivery === 'delivery' ? 'Yetkazib berish' : 'Olib ketish';
}

export function buildTelegramMessage(order: OrderRecord) {
  const products = order.products
    .map((item) => `${item.name} × ${item.quantity}\n${formatPrice(item.price)} × ${item.quantity}\n${formatPrice(item.lineTotal).toLowerCase()}`)
    .join('\n\n');

  return `🍓 LOOKBERRY — YANGI BUYURTMA

━━━━━━━━━━━━━━━━

🆔 BUYURTMA:
#${order.id}

👤 MIJOZ:
${order.customer.name}

📞 TELEFON:
${order.customer.phone}

📍 MANZIL:
${order.customer.address || 'Olib ketish'}

🚚 YETKAZIB BERISH:
${deliveryLabel(order.delivery)}

🕐 VAQT:
${order.day} ${order.time}

━━━━━━━━━━━━━━━━

🛍 MAHSULOTLAR:

${products}

━━━━━━━━━━━━━━━━

💰 MAHSULOTLAR:
${formatPrice(order.subtotal).toLowerCase()}

🚚 YETKAZIB BERISH:
${formatPrice(order.deliveryFee).toLowerCase()}

💰 JAMI:
${formatPrice(order.total).toLowerCase()}

📝 IZOH:
${order.comment || 'Yo\'q'}

━━━━━━━━━━━━━━━━

LOOKBERRY`;
}

export async function sendTelegramOrder(order: OrderRecord) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error('Telegram sozlamalari topilmadi. TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID kiriting.');
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(order),
      disable_web_page_preview: true
    })
  });

  const body = (await response.json().catch(() => null)) as { ok?: boolean; description?: string } | null;

  if (!response.ok || !body?.ok) {
    throw new Error(body?.description || 'Telegram xabarini yuborib bo\'lmadi.');
  }

  return body;
}
