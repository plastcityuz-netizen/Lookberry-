'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, CheckoutForm, DeliveryType, Product, SiteSettings } from '@/types/lookberry';
import { formatPrice, normalizePhone } from '@/lib/format';
import { classNames } from '@/lib/format';

type CheckoutMode = 'cart' | 'quick';

type CartContextType = {
  items: CartItem[];
  favorites: string[];
  count: number;
  subtotal: number;
  isCartOpen: boolean;
  checkoutItems: CartItem[];
  checkoutOpen: boolean;
  checkoutMode: CheckoutMode;
  settings: SiteSettings;
  addToCart: (product: Product, quantity?: number) => void;
  buyNow: (product: Product, quantity?: number) => void;
  openCart: () => void;
  closeCart: () => void;
  removeFromCart: (productId: string) => void;
  changeQuantity: (productId: string, delta: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  checkoutCart: () => void;
  closeCheckout: () => void;
  updateCheckoutQuantity: (productId: string, delta: number) => void;
};

const defaultSettings: SiteSettings = {
  deliveryFee: 15000,
  city: 'Toshkent',
  deliveryNote: "Toshkent bo'ylab premium qadoqlash bilan yetkazib berish.",
  orderStartHour: '10:00',
  orderEndHour: '22:00'
};

const CartContext = createContext<CartContextType | null>(null);

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function clampQuantity(quantity: number) {
  return Math.max(1, Math.min(30, Math.round(quantity || 1)));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('quick');
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readLocal<CartItem[]>('lookberry-cart', []));
    setFavorites(readLocal<string[]>('lookberry-favorites', []));
    setHydrated(true);

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings as SiteSettings);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem('lookberry-cart', JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem('lookberry-favorites', JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item
        );
      }
      return [...current, { product, quantity: clampQuantity(quantity) }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const changeQuantity = useCallback((productId: string, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity: clampQuantity(item.quantity + delta) } : item
      )
    );
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) => current.map((item) => (item.product.id === productId ? { ...item, quantity: clampQuantity(quantity) } : item)));
  }, []);

  const buyNow = useCallback((product: Product, quantity = 1) => {
    setCheckoutItems([{ product, quantity: clampQuantity(quantity) }]);
    setCheckoutMode('quick');
    setCheckoutOpen(true);
    setCartOpen(false);
  }, []);

  const checkoutCart = useCallback(() => {
    setCheckoutItems(items);
    setCheckoutMode('cart');
    setCheckoutOpen(true);
    setCartOpen(false);
  }, [items]);

  const updateCheckoutQuantity = useCallback((productId: string, delta: number) => {
    setCheckoutItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity: clampQuantity(item.quantity + delta) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  }, []);

  const value = useMemo<CartContextType>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    return {
      items,
      favorites,
      count,
      subtotal,
      isCartOpen,
      checkoutItems,
      checkoutOpen,
      checkoutMode,
      settings,
      addToCart,
      buyNow,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      removeFromCart,
      changeQuantity,
      setQuantity,
      clearCart,
      toggleFavorite,
      isFavorite: (productId: string) => favorites.includes(productId),
      checkoutCart,
      closeCheckout: () => setCheckoutOpen(false),
      updateCheckoutQuantity
    };
  }, [items, favorites, isCartOpen, checkoutItems, checkoutOpen, checkoutMode, settings, addToCart, buyNow, removeFromCart, changeQuantity, setQuantity, clearCart, toggleFavorite, checkoutCart, updateCheckoutQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <CheckoutModal onSuccessfulCartCheckout={checkoutMode === 'cart' ? clearCart : undefined} />
      <MobileCartBar />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

function QuantityControl({ quantity, onMinus, onPlus }: { quantity: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-chocolate/10 bg-white/80 p-1 shadow-inner shadow-gold/10">
      <button type="button" aria-label="Kamaytirish" onClick={onMinus} className="grid h-8 w-8 place-items-center rounded-full bg-cream text-lg text-chocolate transition hover:bg-strawberry hover:text-white">−</button>
      <span className="min-w-10 text-center font-semibold text-chocolate">{quantity}</span>
      <button type="button" aria-label="Ko'paytirish" onClick={onPlus} className="grid h-8 w-8 place-items-center rounded-full bg-chocolate text-lg text-white transition hover:bg-strawberry">+</button>
    </div>
  );
}

function CartDrawer() {
  const { items, subtotal, isCartOpen, closeCart, changeQuantity, removeFromCart, checkoutCart } = useCart();

  return (
    <div className={classNames('fixed inset-0 z-[80] transition', isCartOpen ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!isCartOpen}>
      <div className={classNames('absolute inset-0 bg-chocolate/40 backdrop-blur-sm transition-opacity', isCartOpen ? 'opacity-100' : 'opacity-0')} onClick={closeCart} />
      <aside className={classNames('absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col overflow-hidden rounded-l-[2rem] border border-white/50 bg-cream/95 shadow-premium backdrop-blur-2xl transition-transform duration-500', isCartOpen ? 'translate-x-0' : 'translate-x-full')}>
        <div className="border-b border-chocolate/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Premium cart</p>
              <h2 className="font-serif text-3xl text-chocolate">Savatingiz</h2>
            </div>
            <button onClick={closeCart} className="grid h-11 w-11 place-items-center rounded-full bg-white text-2xl text-chocolate shadow-soft transition hover:rotate-90 hover:bg-strawberry hover:text-white" aria-label="Savatni yopish">×</button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-white text-5xl shadow-soft">🛒</div>
              <h3 className="font-serif text-3xl text-chocolate">Savat hozircha bo'sh</h3>
              <p className="mt-3 text-chocolate/65">Yoqimli sovg'a tanlang va buyurtmani bir necha bosqichda yuboring.</p>
              <button onClick={closeCart} className="btn-primary mt-6">Mahsulotlarni ko'rish</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <div key={item.product.id} className="rounded-[1.5rem] border border-white/70 bg-white/75 p-3 shadow-soft">
                  <div className="flex gap-4">
                    <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-[1.25rem] object-cover" />
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-semibold uppercase tracking-wide text-chocolate">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-chocolate/60">{formatPrice(item.product.price)}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <QuantityControl quantity={item.quantity} onMinus={() => changeQuantity(item.product.id, -1)} onPlus={() => changeQuantity(item.product.id, 1)} />
                        <button onClick={() => removeFromCart(item.product.id)} className="text-sm font-medium text-strawberry underline-offset-4 hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-chocolate/10 bg-white/60 p-6">
              <div className="mb-5 flex items-center justify-between text-chocolate">
                <span className="text-lg">Total:</span>
                <strong className="font-serif text-3xl">{formatPrice(subtotal)}</strong>
              </div>
              <button onClick={checkoutCart} className="btn-primary w-full justify-center">BUYURTMANI RASMIYLASHTIRISH</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

const emptyForm: CheckoutForm = {
  name: '',
  phone: '',
  delivery: 'delivery',
  address: '',
  day: 'Bugun',
  time: '18:00',
  comment: ''
};

function CheckoutModal({ onSuccessfulCartCheckout }: { onSuccessfulCartCheckout?: () => void }) {
  const { checkoutOpen, closeCheckout, checkoutItems, checkoutMode, settings, updateCheckoutQuantity } = useCart();
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (checkoutOpen) {
      setStep('form');
      setError('');
      setOrderId('');
      setLoading(false);
    }
  }, [checkoutOpen]);

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const deliveryFee = form.delivery === 'delivery' ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  function update<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    if (!checkoutItems.length) return 'Mahsulot tanlanmagan.';
    if (form.name.trim().length < 2) return 'Ismingizni kiriting.';
    if (form.phone.replace(/\D/g, '').length < 12) return 'Telefon raqamingizni to\'liq kiriting.';
    if (form.delivery === 'delivery' && form.address.trim().length < 5) return 'Manzilni kiriting.';
    if (!form.time) return 'Vaqtni tanlang.';
    return '';
  }

  function goConfirm() {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }
    setError('');
    setStep('confirm');
  }

  async function sendOrder() {
    const validation = validate();
    if (validation) {
      setError(validation);
      setStep('form');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          products: checkoutItems.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
          delivery: form.delivery,
          address: form.address,
          day: form.day,
          time: form.time,
          comment: form.comment,
          total
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Buyurtmani yuborishda xatolik yuz berdi.');
      setOrderId(data.orderId);
      setStep('success');
      if (checkoutMode === 'cart') onSuccessfulCartCheckout?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Buyurtmani yuborishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  }

  if (!checkoutOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-end bg-chocolate/50 p-0 backdrop-blur-md md:place-items-center md:p-6" role="dialog" aria-modal="true">
      <div className="max-h-[96vh] w-full max-w-5xl overflow-hidden rounded-t-[2rem] border border-white/60 bg-cream shadow-premium md:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-chocolate/10 bg-white/45 p-5 md:p-6">
          <div>
            <p className="eyebrow">Product → Options → Customer info → Confirm</p>
            <h2 className="font-serif text-2xl text-chocolate md:text-4xl">Buyurtmani rasmiylashtirish</h2>
          </div>
          <button onClick={closeCheckout} className="grid h-11 w-11 place-items-center rounded-full bg-white text-2xl text-chocolate shadow-soft transition hover:rotate-90 hover:bg-strawberry hover:text-white" aria-label="Checkout yopish">×</button>
        </div>

        <div className="grid max-h-[calc(96vh-96px)] overflow-y-auto md:grid-cols-[1.05fr_.95fr]">
          <div className="space-y-4 p-5 md:p-7">
            {step === 'success' ? (
              <div className="grid min-h-[440px] place-items-center text-center">
                <div>
                  <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-strawberry/10 text-5xl">❤️</div>
                  <p className="eyebrow">#{orderId}</p>
                  <h3 className="font-serif text-4xl text-chocolate">Buyurtmangiz qabul qilindi ❤️</h3>
                  <p className="mx-auto mt-4 max-w-md text-chocolate/70">Tez orada siz bilan bog'lanamiz. Buyurtma Telegram orqali Lookberry jamoasiga yuborildi.</p>
                  <button onClick={closeCheckout} className="btn-primary mt-8">Yopish</button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl text-chocolate">Tanlangan mahsulotlar</h3>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-chocolate/70">{checkoutItems.length} tur</span>
                  </div>
                  {checkoutItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 rounded-[1.5rem] border border-white/70 bg-white/70 p-3 shadow-soft">
                      <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-[1.25rem] object-cover md:h-28 md:w-28" />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h4 className="font-semibold uppercase tracking-wide text-chocolate">{item.product.name}</h4>
                          <p className="text-sm text-chocolate/60">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <QuantityControl quantity={item.quantity} onMinus={() => updateCheckoutQuantity(item.product.id, -1)} onPlus={() => updateCheckoutQuantity(item.product.id, 1)} />
                          <strong className="text-chocolate">{formatPrice(item.quantity * item.product.price)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {step === 'form' ? (
                  <div className="space-y-4 rounded-[1.75rem] border border-white/80 bg-white/55 p-4 shadow-soft md:p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="field-label md:col-span-1">
                        ISMINGIZ
                        <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ali" className="field-input" autoComplete="name" />
                      </label>
                      <label className="field-label md:col-span-1">
                        TELEFON RAQAMINGIZ
                        <input value={form.phone} onChange={(e) => update('phone', normalizePhone(e.target.value))} placeholder="+998 90 123 45 67" className="field-input" inputMode="tel" autoComplete="tel" />
                      </label>
                    </div>

                    <div>
                      <p className="field-title">DELIVERY</p>
                      <div className="grid gap-3 md:grid-cols-2">
                        {([
                          ['delivery', 'Yetkazib berish', `+ ${formatPrice(settings.deliveryFee)}`],
                          ['pickup', 'Olib ketish', "Lookberry'dan olib ketish"]
                        ] as Array<[DeliveryType, string, string]>).map(([value, label, description]) => (
                          <button key={value} type="button" onClick={() => update('delivery', value)} className={classNames('rounded-[1.25rem] border p-4 text-left transition', form.delivery === value ? 'border-strawberry bg-strawberry/10 shadow-soft' : 'border-chocolate/10 bg-white/70 hover:border-gold') }>
                            <span className="flex items-center gap-2 font-semibold text-chocolate"><span className="grid h-5 w-5 place-items-center rounded-full border border-current text-[10px]">{form.delivery === value ? '●' : ''}</span>{label}</span>
                            <span className="mt-1 block text-sm text-chocolate/60">{description}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.delivery === 'delivery' && (
                      <label className="field-label">
                        MANZIL
                        <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Toshkent, Chilonzor, 7-mavze" className="field-input" autoComplete="street-address" />
                      </label>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="field-label">
                        YETKAZIB BERISH KUNI
                        <select value={form.day} onChange={(e) => update('day', e.target.value)} className="field-input">
                          <option>Bugun</option>
                          <option>Ertaga</option>
                          <option>Maxsus sana</option>
                        </select>
                      </label>
                      <label className="field-label">
                        YETKAZIB BERISH VAQTI
                        <select value={form.time} onChange={(e) => update('time', e.target.value)} className="field-input">
                          {['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map((time) => (
                            <option key={time}>{time}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="field-label">
                      IZOH
                      <textarea value={form.comment} onChange={(e) => update('comment', e.target.value)} placeholder="Tug'ilgan kun uchun, yozuv qo'shish, eshik kodi..." className="field-input min-h-28 resize-y" />
                    </label>
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border border-gold/30 bg-white/70 p-5 shadow-soft">
                    <p className="eyebrow">Order confirmation</p>
                    <h3 className="font-serif text-3xl text-chocolate">Buyurtmangiz</h3>
                    <div className="mt-5 space-y-3 text-chocolate/75">
                      <SummaryRow label="Mijoz" value={form.name} />
                      <SummaryRow label="Telefon" value={form.phone} />
                      <SummaryRow label="Yetkazib berish" value={form.delivery === 'delivery' ? 'Yetkazib berish' : 'Olib ketish'} />
                      {form.delivery === 'delivery' && <SummaryRow label="Manzil" value={form.address} />}
                      <SummaryRow label="Vaqt" value={`${form.day} ${form.time}`} />
                      {form.comment && <SummaryRow label="Izoh" value={form.comment} />}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-strawberry/25 bg-strawberry/10 p-4 font-medium text-strawberry">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t border-chocolate/10 bg-chocolate p-5 text-white md:border-l md:border-t-0 md:p-7">
            <div className="sticky top-4 rounded-[1.75rem] border border-white/10 bg-white/[.06] p-5 shadow-premium backdrop-blur">
              <p className="eyebrow text-gold">Complete summary</p>
              <h3 className="font-serif text-3xl">Buyurtmangiz</h3>
              <div className="mt-6 space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 border-b border-white/10 pb-4 last:border-0">
                    <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 font-semibold uppercase tracking-wide">{item.product.name}</p>
                      <p className="text-sm text-white/60">×{item.quantity} · {formatPrice(item.product.price).toLowerCase()}</p>
                    </div>
                    <strong>{formatPrice(item.quantity * item.product.price)}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <SummaryRow dark label="Mahsulotlar" value={formatPrice(subtotal)} />
                <SummaryRow dark label="Yetkazib berish" value={formatPrice(deliveryFee)} />
              </div>
              <div className="mt-6 rounded-[1.25rem] bg-white p-4 text-chocolate">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-[.2em] text-chocolate/55">JAMI</span>
                  <strong className="font-serif text-3xl">{formatPrice(total)}</strong>
                </div>
              </div>

              {step !== 'success' && (
                <div className="mt-5 flex flex-col gap-3">
                  {step === 'form' ? (
                    <button onClick={goConfirm} className="btn-primary w-full justify-center">BUYURTMANI TASDIQLASH</button>
                  ) : (
                    <>
                      <button onClick={sendOrder} disabled={loading} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'YUBORILMOQDA...' : 'BUYURTMANI YUBORISH'}</button>
                      <button onClick={() => setStep('form')} className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10">Ma'lumotlarni tahrirlash</button>
                    </>
                  )}
                  {error && step === 'confirm' && <button onClick={sendOrder} disabled={loading} className="rounded-full bg-white px-5 py-3 font-bold text-strawberry">QAYTA URINISH</button>}
                </div>
              )}

              <p className="mt-5 text-center text-xs leading-relaxed text-white/45">Buyurtma siz tasdiqlaganingizdan keyin backend orqali Telegram @lookberrys manziliga yuboriladi. Token frontendga chiqarilmaydi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={classNames('flex items-start justify-between gap-5', dark ? 'text-white/75' : 'text-chocolate/75')}>
      <span>{label}</span>
      <strong className={classNames('max-w-[65%] text-right', dark ? 'text-white' : 'text-chocolate')}>{value}</strong>
    </div>
  );
}

function MobileCartBar() {
  const { count, subtotal, openCart } = useCart();
  if (!count) return null;
  return (
    <button onClick={openCart} className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-center gap-2 rounded-full bg-chocolate px-5 py-4 font-bold text-white shadow-premium md:hidden">
      🛒 Savat — {count} ta — {formatPrice(subtotal).toLowerCase()}
    </button>
  );
}
