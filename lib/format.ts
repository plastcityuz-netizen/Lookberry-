export function formatPrice(amount: number) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + " SO'M";
}

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const noPrefix = digits.startsWith('998') ? digits.slice(3) : digits;
  const clean = noPrefix.slice(0, 9);
  const parts = [clean.slice(0, 2), clean.slice(2, 5), clean.slice(5, 7), clean.slice(7, 9)].filter(Boolean);
  return '+998 ' + parts.join(' ');
}

export function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(' ');
}
