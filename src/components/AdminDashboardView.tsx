import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';
import {
  CATEGORIES,
  CouponItem,
  Language,
  OrderRecord,
  ProductItem,
  SellerProfile,
} from '../data/marketplaceData';

interface AdminDashboardViewProps {
  language: Language;
  products: ProductItem[];
  sellers: SellerProfile[];
  orders: OrderRecord[];
  coupons: CouponItem[];
  heroBannerConfig: {
    kickerEn: string;
    kickerHi: string;
    headlineEn: string;
    headlineHi: string;
    announcementEn: string;
    announcementHi: string;
  };
  onToggleSellerApproval: (sellerId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleBestseller: (productId: string) => void;
  onCreateCoupon: (coupon: CouponItem) => void;
  onToggleCoupon: (code: string) => void;
  onUpdateHeroBanner: (cfg: AdminDashboardViewProps['heroBannerConfig']) => void;
  onVerifyOrderPayment: (orderId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  products,
  sellers,
  orders,
  coupons,
  heroBannerConfig,
  onToggleSellerApproval,
  onDeleteProduct,
  onToggleBestseller,
  onCreateCoupon,
  onToggleCoupon,
  onUpdateHeroBanner,
  onVerifyOrderPayment,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'sellers' | 'products' | 'orders-payments' | 'coupons-banners'
  >('overview');

  // New Coupon State
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState('20');
  const [newMaxDisc, setNewMaxDisc] = useState('750');
  const [newMinOrder, setNewMinOrder] = useState('999');
  const [newDesc, setNewDesc] = useState('Festival Special 20% Off');

  // Banner Editor State
  const [bannerState, setBannerState] = useState(heroBannerConfig);
  const [bannerSaved, setBannerSaved] = useState(false);

  const totalGmv = orders.reduce((acc, o) => acc + o.total, 0) + 1842900;
  const approvedSellersCount = sellers.filter((s) => s.verified).length;

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    onCreateCoupon({
      code: newCode.trim().toUpperCase(),
      discountPercent: Number(newPercent) || 10,
      maxDiscount: Number(newMaxDisc) || 500,
      minOrder: Number(newMinOrder) || 499,
      descriptionEn: newDesc.trim(),
      descriptionHi: newDesc.trim(),
      active: true,
    });
    setNewCode('');
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHeroBanner(bannerState);
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 1400);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-[#9A3412] font-semibold">
            Bhakti Bazaar Central Governance & Marketplace Operations
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231715]">
            Admin Console & Sales Intelligence
          </h1>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#6E5A4F] tabular-nums">
          <span>18 Sacred Categories</span>
          <span aria-hidden="true">·</span>
          <span>{products.length} Active SKUs</span>
          <span aria-hidden="true">·</span>
          <span>{sellers.length} Registered Vendors</span>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Marketplace GMV (30d)</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715]">
            ₹{totalGmv.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-[#1F6E43]">+28.4% during Kartik Masa</span>
        </div>
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Verified Temple Sellers</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715]">
            {approvedSellersCount} / {sellers.length}
          </p>
          <span className="text-xs text-[#9A3412]">
            {sellers.length - approvedSellersCount} awaiting KYC approval
          </span>
        </div>
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Catalog Products & Categories</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715]">
            {products.length} SKUs · 18 Cats
          </p>
          <span className="text-xs text-[#6E5A4F]">100% Sanctity Audited</span>
        </div>
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Active Festival Coupons</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715]">
            {coupons.filter((c) => c.active).length}
          </p>
          <span className="text-xs text-[#6E5A4F]">Live in Checkout</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFE7DA] rounded-xl">
        {[
          { id: 'overview', label: 'Sales Reports & 18 Categories' },
          { id: 'sellers', label: `Seller Approvals (${sellers.length})` },
          { id: 'products', label: `All Products (${products.length})` },
          { id: 'orders-payments', label: `Orders, Customers & Payments (${orders.length})` },
          { id: 'coupons-banners', label: 'Coupons & Homepage Banners' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === t.id
                ? 'bg-[#FFFDF9] text-[#5B1818] shadow-xs'
                : 'text-[#5A493E] hover:text-[#231715]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Sales Reports & Category Matrix */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#231715] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C85A17]" />
                <span>Revenue Share by Devotional Community</span>
              </h2>
              <span className="text-xs text-[#6E5A4F]">Kartik / Festival Quarter</span>
            </div>

            <div className="space-y-3.5 pt-2">
              {[
                { label: 'Radha Krishna & Braj Seva (Vrindavan / Mathura)', share: 38, amount: '₹7,02,400' },
                { label: 'ISKCON & Gaudiya Vaishnav (Tulsi, Japa & Kirtan)', share: 27, amount: '₹4,98,100' },
                { label: 'Lord Shiva / Kashi Rudraksha & Abhishek', share: 14, amount: '₹2,58,000' },
                { label: 'Lord Rama & Hanuman (Ayodhya Idols & Granths)', share: 12, amount: '₹2,21,150' },
                { label: 'Mata Rani Shringar & Shakti Puja Samagri', share: 9, amount: '₹1,63,250' },
              ].map((row, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium text-[#231715]">
                    <span>{row.label}</span>
                    <span className="font-mono-num">
                      {row.amount} ({row.share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#EFE7DA] overflow-hidden">
                    <div
                      className="h-full bg-[#C85A17] rounded-full"
                      style={{ width: `${row.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#231715]">
              All 18 Devotional Categories Directory
            </h2>
            <div className="max-h-72 overflow-y-auto divide-y divide-[#EFE7DA] pr-1 text-xs">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-mono-num text-[#8C7A6B] mr-1.5">
                      {String(cat.number).padStart(2, '0')}.
                    </span>
                    <span className="font-semibold text-[#231715]">{cat.nameEn}</span>
                    <span className="text-[#6E5A4F] ml-1.5">({cat.nameHi})</span>
                  </div>
                  <span className="font-mono-num text-[#5B1818] font-medium shrink-0">
                    {cat.itemCount} items
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Seller Approvals */}
      {activeTab === 'sellers' && (
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#231715]">
            Vendor KYC & Verified Artisan Badge Approvals
          </h2>
          <div className="divide-y divide-[#EFE7DA]">
            {sellers.map((s) => (
              <div
                key={s.id}
                className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#231715]">{s.shopName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#6E5A4F]">{s.city}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num text-[#6E5A4F]">GST: {s.gstNumber}</span>
                  </div>
                  <p className="text-[#4A3B32]">
                    Proprietor: <strong>{s.ownerName}</strong> · Specialty: {s.specialty}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      s.verified ? 'text-[#1F6E43]' : 'text-[#B45309]'
                    }`}
                  >
                    {s.verified ? 'Verified Seller Badge Active' : 'Pending Verification'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleSellerApproval(s.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      s.verified
                        ? 'bg-[#FAF7F2] border border-[#DED4C6] text-[#5B1818]'
                        : 'bg-[#1F6E43] text-white'
                    }`}
                  >
                    {s.verified ? 'Revoke Badge' : 'Approve & Grant Verified Badge'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: All Products Management */}
      {activeTab === 'products' && (
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#EFE7DA]">
            <h2 className="font-display text-xl font-bold text-[#231715]">
              Master Product Catalog Governance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#6E5A4F] border-b border-[#EFE7DA]">
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Bestseller Status</th>
                  <th className="py-3 px-4">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7DA]">
                {products.map((p) => {
                  const isBest = p.collectionTags.includes('bestseller');
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60">
                      <td className="py-3 px-4 font-mono-num text-[#6E5A4F]">{p.sku}</td>
                      <td className="py-3 px-4 font-semibold text-[#231715] max-w-xs truncate">
                        {p.nameEn}
                      </td>
                      <td className="py-3 px-4 text-[#6E5A4F]">{p.categoryNameEn}</td>
                      <td className="py-3 px-4 text-[#6E5A4F]">{p.sellerName}</td>
                      <td className="py-3 px-4 font-mono-num font-semibold">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onToggleBestseller(p.id)}
                          className={`px-3 py-1 rounded border text-xs font-medium ${
                            isBest
                              ? 'bg-[#FAF7F2] border-[#C85A17] text-[#C85A17]'
                              : 'border-[#DED4C6] text-[#6E5A4F]'
                          }`}
                        >
                          {isBest ? '★ Featured Bestseller' : 'Mark Bestseller'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => onDeleteProduct(p.id)}
                          className="text-[#B42318] hover:opacity-75"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Orders, Customers & Payment Verification */}
      {activeTab === 'orders-payments' && (
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#231715] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C85A17]" />
              <span>Customer Orders & Payment Reconciliation</span>
            </h2>
          </div>

          <div className="divide-y divide-[#EFE7DA]">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-[#5B1818]">{ord.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#231715]">{ord.customerName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#6E5A4F]">{ord.customerPhone}</span>
                  </div>
                  <p className="text-[#6E5A4F]">
                    Destination: {ord.shippingAddress}, {ord.city} ({ord.pincode})
                  </p>
                  <p className="text-[#4A3B32]">
                    Method: <strong>{ord.paymentMethod}</strong> · Status:{' '}
                    <strong className="text-[#9A3412]">{ord.paymentStatus}</strong>
                    {ord.paymentReference ? ` (${ord.paymentReference})` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono-num text-sm font-bold text-[#231715]">
                    ₹{ord.total.toLocaleString('en-IN')}
                  </span>
                  {ord.paymentStatus === 'Awaiting Verification' && (
                    <button
                      type="button"
                      onClick={() => onVerifyOrderPayment(ord.id)}
                      className="px-3.5 py-2 rounded-lg bg-[#1F6E43] text-white text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify UTR & Approve</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Coupons & Homepage Campaign Banners */}
      {activeTab === 'coupons-banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coupon Creator */}
          <div className="lg:col-span-6 bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-5">
            <h2 className="font-display text-xl font-bold text-[#231715] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#C85A17]" />
              <span>Create & Manage Discount Coupons</span>
            </h2>

            <form onSubmit={handleAddCoupon} className="space-y-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0]">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Coupon Code (e.g., DIWALI25)"
                  className="px-3 py-2 text-xs font-mono-num uppercase bg-white border border-[#DED4C6] rounded-lg"
                />
                <input
                  type="number"
                  required
                  value={newPercent}
                  onChange={(e) => setNewPercent(e.target.value)}
                  placeholder="Discount %"
                  className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                />
                <input
                  type="number"
                  required
                  value={newMaxDisc}
                  onChange={(e) => setNewMaxDisc(e.target.value)}
                  placeholder="Max Discount ₹"
                  className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                />
                <input
                  type="number"
                  required
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  placeholder="Min Order ₹"
                  className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                />
              </div>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Offer Description"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#5B1818] text-white text-xs font-semibold"
              >
                + Create Live Coupon
              </button>
            </form>

            <div className="divide-y divide-[#EFE7DA] text-xs">
              {coupons.map((c) => (
                <div key={c.code} className="py-3 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-mono-num font-bold text-[#5B1818]">{c.code}</span>
                    <span className="text-[#6E5A4F] ml-2">
                      {c.discountPercent}% off up to ₹{c.maxDiscount} (Min ₹{c.minOrder})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleCoupon(c.code)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      c.active
                        ? 'bg-[#ECFDF3] text-[#1F6E43]'
                        : 'bg-[#FEF3F2] text-[#B42318]'
                    }`}
                  >
                    {c.active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Homepage Banner Manager */}
          <form
            onSubmit={handleSaveBanner}
            className="lg:col-span-6 bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-[#231715]">
              Homepage Hero Campaign & Banner Manager
            </h2>
            {bannerSaved && (
              <div className="p-3 rounded-lg bg-[#ECFDF3] text-[#1F6E43] text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Storefront Hero & Top Banner updated live!</span>
              </div>
            )}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#231715] mb-1">
                  Top Promotional Bar Announcement (English)
                </label>
                <input
                  type="text"
                  value={bannerState.announcementEn}
                  onChange={(e) =>
                    setBannerState({ ...bannerState, announcementEn: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#231715] mb-1">
                  Hero Kicker (English)
                </label>
                <input
                  type="text"
                  value={bannerState.kickerEn}
                  onChange={(e) => setBannerState({ ...bannerState, kickerEn: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#231715] mb-1">
                  Hero Main Headline (English)
                </label>
                <input
                  type="text"
                  value={bannerState.headlineEn}
                  onChange={(e) => setBannerState({ ...bannerState, headlineEn: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#231715] mb-1">
                  Hero Main Headline (Hindi)
                </label>
                <input
                  type="text"
                  value={bannerState.headlineHi}
                  onChange={(e) => setBannerState({ ...bannerState, headlineHi: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#5B1818] text-white text-xs font-semibold hover:bg-[#7A2020]"
            >
              Publish Campaign Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
