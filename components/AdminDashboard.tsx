'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import type { OrderRecord, OrderStatus, Product, SiteSettings } from '@/types/lookberry';
import { formatPrice } from '@/lib/format';
import { classNames } from '@/lib/format';

const statuses: OrderStatus[] = ['Yangi', 'Qabul qilindi', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Yetkazildi', 'Bekor qilindi'];
const categories = ['qulupnay', 'shokolad', 'kruassan', 'mevali', 'gift'] as const;

type ProductForm = Omit<Product, 'ingredients' | 'tags'> & { ingredients: string; tags: string };

const blankProduct: ProductForm = {
  id: '',
  slug: '',
  name: '',
  price: 50000,
  image: '/products/qulupnay-box.jpg',
  shortIngredients: '',
  ingredients: '',
  description: '',
  category: 'gift',
  tags: '',
  badge: 'Premium',
  popular: false,
  isNew: false,
  available: true
};

const defaultSettings: SiteSettings = {
  deliveryFee: 15000,
  city: 'Toshkent',
  deliveryNote: "Toshkent bo'ylab premium qadoqlash bilan yetkazib berish.",
  orderStartHour: '10:00',
  orderEndHour: '22:00'
};

function toForm(product: Product): ProductForm {
  return {
    ...product,
    ingredients: product.ingredients.join(', '),
    tags: product.tags.join(', ')
  };
}

function fromForm(form: ProductForm): Product {
  return {
    ...form,
    price: Number(form.price),
    ingredients: form.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
    tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean)
  };
}

export function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [form, setForm] = useState<ProductForm>(blankProduct);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const headers = useMemo(() => ({ 'content-type': 'application/json', 'x-admin-password': password }), [password]);

  useEffect(() => {
    const saved = window.localStorage.getItem('lookberry-admin-password') || '';
    setPassword(saved);
  }, []);

  useEffect(() => {
    if (password) window.localStorage.setItem('lookberry-admin-password', password);
  }, [password]);

  async function load() {
    setLoading(true);
    setMessage('');
    try {
      const [productsRes, ordersRes, settingsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders', { headers: { 'x-admin-password': password } }),
        fetch('/api/settings')
      ]);
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const settingsData = await settingsRes.json();
      setProducts(productsData.products || []);
      if (ordersRes.ok) setOrders(ordersData.orders || []);
      else setMessage(ordersData.error || 'Buyurtmalarni ko\'rish uchun admin parol kerak.');
      if (settingsData.settings) setSettings(settingsData.settings);
    } catch {
      setMessage('Ma\'lumotlarni yuklashda xatolik.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const product = fromForm(form);
      const response = await fetch('/api/products', {
        method: product.id ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(product)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Mahsulot saqlanmadi.');
      setMessage('Mahsulot saqlandi.');
      setForm(blankProduct);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Mahsulot saqlanmadi.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm('Mahsulot o\'chirilsinmi?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE', headers: { 'x-admin-password': password } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'O\'chirilmadi.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'O\'chirilmadi.');
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000) {
      setMessage('Rasm 2.5MB dan kichik bo\'lishi kerak.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result || current.image) }));
    reader.readAsDataURL(file);
  }

  async function changeOrderStatus(id: string, status: OrderStatus) {
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Status yangilanmadi.');
      return;
    }
    setOrders((current) => current.map((order) => (order.id === id ? data.order : order)));
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/settings', { method: 'PATCH', headers, body: JSON.stringify(settings) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Sozlamalar saqlanmadi.');
      setSettings(data.settings);
      setMessage('Sozlamalar saqlandi.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sozlamalar saqlanmadi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream pt-28">
      <section className="section-pad">
        <div className="container-premium">
          <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/65 p-6 shadow-soft">
            <p className="eyebrow">Lookberry admin</p>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="font-serif text-5xl text-chocolate">Admin dashboard</h1>
                <p className="mt-2 text-chocolate/60">Mahsulotlar, buyurtmalar va yetkazib berish sozlamalarini boshqarish.</p>
              </div>
              <label className="field-label min-w-72">
                ADMIN PASSWORD
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="ADMIN_PASSWORD" className="field-input" />
              </label>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {([
                ['orders', 'Orders'],
                ['products', 'Products'],
                ['settings', 'Delivery settings']
              ] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className={classNames('rounded-full px-5 py-3 font-bold transition', tab === id ? 'bg-chocolate text-white' : 'bg-cream text-chocolate hover:bg-gold/20')}>{label}</button>
              ))}
              <button onClick={load} className="rounded-full bg-white px-5 py-3 font-bold text-chocolate shadow-soft">Refresh</button>
            </div>
            {message && <div className="mt-5 rounded-2xl bg-gold/15 p-4 font-medium text-chocolate">{message}</div>}
          </div>

          {tab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Empty title="Buyurtmalar yo'q" text="Telegramga muvaffaqiyatli yuborilgan buyurtmalar shu yerda ko'rinadi." />
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-soft">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div>
                        <p className="eyebrow">#{order.id} · {new Date(order.createdAt).toLocaleString('uz-UZ')}</p>
                        <h2 className="font-serif text-3xl text-chocolate">{order.customer.name}</h2>
                        <p className="mt-1 text-chocolate/65">{order.customer.phone} · {order.deliveryLabel} · {order.day} {order.time}</p>
                        {order.customer.address && <p className="text-chocolate/65">📍 {order.customer.address}</p>}
                      </div>
                      <select value={order.status} onChange={(event) => changeOrderStatus(order.id, event.target.value as OrderStatus)} className="field-input min-w-56">
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {order.products.map((item) => (
                        <div key={item.productId} className="flex gap-3 rounded-2xl bg-cream/80 p-3">
                          <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-chocolate">{item.name}</p>
                            <p className="text-sm text-chocolate/60">×{item.quantity} · {formatPrice(item.lineTotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-chocolate/10 pt-4">
                      <p className="text-chocolate/60">Izoh: {order.comment || "Yo'q"}</p>
                      <strong className="font-serif text-3xl text-strawberry">{formatPrice(order.total)}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'products' && (
            <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
              <form onSubmit={saveProduct} className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-soft">
                <p className="eyebrow">Add / edit product</p>
                <h2 className="font-serif text-3xl text-chocolate">Mahsulot</h2>
                <div className="mt-5 grid gap-4">
                  <label className="field-label">NOMI<input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
                  <label className="field-label">NARX<input className="field-input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required /></label>
                  <label className="field-label">KATEGORIYA<select className="field-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}>{categories.map((cat) => <option key={cat}>{cat}</option>)}</select></label>
                  <label className="field-label">QISQA INGREDIENTLAR<input className="field-input" value={form.shortIngredients} onChange={(e) => setForm({ ...form, shortIngredients: e.target.value })} /></label>
                  <label className="field-label">INGREDIENTLAR (vergul bilan)<input className="field-input" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} /></label>
                  <label className="field-label">TAVSIF<textarea className="field-input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                  <label className="field-label">TEGLAR<input className="field-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
                  <label className="field-label">BADGE<input className="field-input" value={form.badge || ''} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></label>
                  <label className="field-label">RASM URL<input className="field-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
                  <label className="field-label">YOKI RASM YUKLASH<input type="file" accept="image/*" onChange={uploadImage} className="field-input file:mr-4 file:rounded-full file:border-0 file:bg-chocolate file:px-4 file:py-2 file:font-bold file:text-white" /></label>
                  {form.image && <img src={form.image} alt="Preview" className="h-48 w-full rounded-2xl object-cover" />}
                  <div className="flex flex-wrap gap-4 text-sm font-semibold text-chocolate">
                    <label><input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Bestseller</label>
                    <label><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} /> Yangi</label>
                    <label><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Mavjud</label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button disabled={loading} className="btn-primary justify-center">Saqlash</button>
                    <button type="button" onClick={() => setForm(blankProduct)} className="btn-secondary justify-center">Tozalash</button>
                  </div>
                </div>
              </form>

              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-soft">
                    <div className="flex gap-4">
                      <img src={product.image} alt={product.name} className="h-24 w-24 rounded-2xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif text-2xl uppercase text-chocolate">{product.name}</h3>
                        <p className="text-sm text-chocolate/60">{product.category} · {formatPrice(product.price)} · {product.available ? 'Mavjud' : 'Oʼchiq'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => setForm(toForm(product))} className="rounded-full bg-chocolate px-4 py-2 text-sm font-bold text-white">Edit</button>
                          <button onClick={() => deleteProduct(product.id)} className="rounded-full bg-strawberry px-4 py-2 text-sm font-bold text-white">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'settings' && (
            <form onSubmit={saveSettings} className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft">
              <p className="eyebrow">Configurable delivery</p>
              <h2 className="font-serif text-3xl text-chocolate">Yetkazib berish sozlamalari</h2>
              <div className="mt-5 grid gap-4">
                <label className="field-label">YETKAZIB BERISH NARXI<input className="field-input" type="number" value={settings.deliveryFee} onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })} /></label>
                <label className="field-label">SHAHAR<input className="field-input" value={settings.city} onChange={(e) => setSettings({ ...settings, city: e.target.value })} /></label>
                <label className="field-label">IZOH<textarea className="field-input min-h-28" value={settings.deliveryNote} onChange={(e) => setSettings({ ...settings, deliveryNote: e.target.value })} /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field-label">BOSHLANISH<input className="field-input" value={settings.orderStartHour} onChange={(e) => setSettings({ ...settings, orderStartHour: e.target.value })} /></label>
                  <label className="field-label">TUGASH<input className="field-input" value={settings.orderEndHour} onChange={(e) => setSettings({ ...settings, orderEndHour: e.target.value })} /></label>
                </div>
                <button disabled={loading} className="btn-primary justify-center">Sozlamalarni saqlash</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/70 p-10 text-center shadow-soft">
      <div className="text-5xl">🍓</div>
      <h2 className="mt-4 font-serif text-4xl text-chocolate">{title}</h2>
      <p className="mt-2 text-chocolate/60">{text}</p>
    </div>
  );
}
