import React, { useState } from 'react';
import {
  CheckCircle2,
  IndianRupee,
  Package,
  Plus,
  ShieldCheck,
  Star,
  Store,
  Truck,
  Upload,
} from 'lucide-react';
import {
  CATEGORIES,
  GENERATED_IMAGES,
  Language,
  OrderRecord,
  ProductItem,
  SellerProfile,
  TRADITIONS,
  TraditionId,
} from '../data/marketplaceData';
import { SacredImage } from './SacredImage';

interface SellerDashboardViewProps {
  language: Language;
  sellers: SellerProfile[];
  products: ProductItem[];
  orders: OrderRecord[];
  onRegisterSeller: (seller: Omit<SellerProfile, 'id' | 'joinedDate' | 'rating' | 'totalSales' | 'balance' | 'verified' | 'status'>) => void;
  onAddProduct: (product: ProductItem) => void;
  onUpdateProductPriceStock: (productId: string, newPrice: number, newStock: number) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderRecord['orderStatus']) => void;
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  language,
  sellers,
  products,
  orders,
  onRegisterSeller,
  onAddProduct,
  onUpdateProductPriceStock,
  onUpdateOrderStatus,
}) => {
  const [activeSellerId, setActiveSellerId] = useState<string>(sellers[0]?.id || 'seller-vrindavan-1');
  const [activeTab, setActiveTab] = useState<
    'inventory' | 'add-product' | 'orders' | 'earnings' | 'reviews' | 'register'
  >('inventory');

  // New Product Form State
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodNameHi, setProdNameHi] = useState('');
  const [prodCategory, setProdCategory] = useState(CATEGORIES[0].id);
  const [prodTradition, setProdTradition] = useState<TraditionId>('radha-krishna');
  const [prodPrice, setProdPrice] = useState('699');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('999');
  const [prodStock, setProdStock] = useState('40');
  const [prodMaterial, setProdMaterial] = useState('100% Pure Vrindavan Sacred Craft');
  const [prodOrigin, setProdOrigin] = useState('Vrindavan, Uttar Pradesh');
  const [prodSizes, setProdSizes] = useState('Standard Size, Large Temple Size');
  const [prodVariations, setProdVariations] = useState('Natural Finish, Festival Edition');
  const [prodImage, setProdImage] = useState<string>(GENERATED_IMAGES.tulsiMala);
  const [prodDesc, setProdDesc] = useState('');
  const [prodAddedBanner, setProdAddedBanner] = useState(false);

  // Seller Registration Form State
  const [regShopName, setRegShopName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regGst, setRegGst] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const currentSeller = sellers.find((s) => s.id === activeSellerId) || sellers[0];
  const sellerProducts = products.filter((p) => p.sellerId === currentSeller?.id);
  const sellerReviews = sellerProducts.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, productName: p.nameEn }))
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProdImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNameEn.trim()) return;
    const catObj = CATEGORIES.find((c) => c.id === prodCategory) || CATEGORIES[0];
    const tradObj = TRADITIONS.find((t) => t.id === prodTradition) || TRADITIONS[0];

    const newItem: ProductItem = {
      id: `prod-custom-${Date.now()}`,
      sku: `BB-${Math.floor(100 + Math.random() * 899)}`,
      nameEn: prodNameEn.trim(),
      nameHi: prodNameHi.trim() || prodNameEn.trim(),
      categoryId: catObj.id,
      categoryNameEn: catObj.nameEn,
      categoryNameHi: catObj.nameHi,
      tradition: prodTradition,
      traditionLabel: tradObj.labelEn,
      collectionTags: ['new-arrival', 'vrindavan-special'],
      festivals: ['janmashtami', 'diwali'],
      price: Math.max(50, Number(prodPrice) || 499),
      originalPrice: Math.max(Number(prodPrice) || 499, Number(prodOriginalPrice) || 799),
      rating: 5.0,
      reviewCount: 1,
      inStock: (Number(prodStock) || 0) > 0,
      stockCount: Number(prodStock) || 25,
      sellerId: currentSeller.id,
      sellerName: currentSeller.shopName,
      sellerLocation: currentSeller.city,
      verifiedSeller: currentSeller.verified,
      authenticityNoteEn: `${prodMaterial} · Direct from ${prodOrigin}`,
      authenticityNoteHi: `${prodMaterial} · ${prodOrigin} से सीधे`,
      shortDescEn: prodDesc.trim() || 'Handcrafted devotional offering prepared by traditional temple artisans.',
      shortDescHi: prodDesc.trim() || 'पारंपरिक मंदिर कारीगरों द्वारा निर्मित पवित्र भक्ति सामग्री।',
      descriptionEn:
        prodDesc.trim() ||
        'Prepared with strict adherence to sattvic standards and traditional craftsmanship for daily home puja and temple seva.',
      descriptionHi:
        prodDesc.trim() ||
        'दैनिक गृह पूजा और मंदिर सेवा के लिए सात्विक मानकों और पारंपरिक शिल्प कौशल के साथ तैयार।',
      sizes: prodSizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      variations: prodVariations
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
      material: prodMaterial,
      origin: prodOrigin,
      deliveryDays: 3,
      image: prodImage,
      gallery: [prodImage],
      statusTag: 'New Vendor Listing',
      specs: [
        { labelEn: 'Artisan Origin', labelHi: 'उद्गम', value: prodOrigin },
        { labelEn: 'Material Grade', labelHi: 'सामग्री', value: prodMaterial },
      ],
      reviews: [],
    };

    onAddProduct(newItem);
    setProdNameEn('');
    setProdNameHi('');
    setProdDesc('');
    setProdAddedBanner(true);
    setTimeout(() => {
      setProdAddedBanner(false);
      setActiveTab('inventory');
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regShopName.trim() || !regOwnerName.trim() || !regCity.trim()) return;
    onRegisterSeller({
      shopName: regShopName.trim(),
      ownerName: regOwnerName.trim(),
      city: regCity.trim(),
      gstNumber: regGst.trim() || '09AAFCB1200D1Z5',
      specialty: regSpecialty.trim() || 'Traditional Puja & Seva Samagri',
    });
    setRegShopName('');
    setRegOwnerName('');
    setRegCity('');
    setRegGst('');
    setRegSpecialty('');
    setRegSuccess(true);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Seller Header & Active Vendor Switcher */}
      <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#6E5A4F]">
            <Store className="w-4 h-4 text-[#C85A17]" />
            <span>Bhakti Bazaar Artisan & Temple Vendor Hub</span>
            <span aria-hidden="true">·</span>
            <span>GST & Direct Bank Settlement Enabled</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231715]">
            {language === 'hi' ? 'विक्रेता डैशबोर्ड (Seller Studio)' : 'Seller Dashboard & Artisan Portal'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-medium text-[#6E5A4F]">Active Vendor Account:</label>
          <select
            value={activeSellerId}
            onChange={(e) => setActiveSellerId(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED4C6] text-xs font-semibold text-[#231715]"
          >
            {sellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.shopName} ({s.city}) {s.verified ? '✓ Verified' : '• Pending'}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className="px-4 py-2 rounded-lg bg-[#5B1818] text-white text-xs font-semibold hover:bg-[#7A2020] whitespace-nowrap shrink-0"
          >
            + Register New Vendor
          </button>
        </div>
      </div>

      {/* KPI Strip in Tabular Numerals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Withdrawable Earnings</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715]">
            ₹{currentSeller.balance.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-[#1F6E43]">Next NEFT Payout: Monday 10 AM</span>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Completed Seva Orders</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715]">
            {currentSeller.totalSales.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-[#6E5A4F]">Across 19,000+ Indian Pincodes</span>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Active Catalog SKUs</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715]">
            {sellerProducts.length}
          </p>
          <span className="text-xs text-[#6E5A4F]">Live in Storefront</span>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 space-y-1">
          <span className="text-xs text-[#6E5A4F]">Vendor Trust & Rating</span>
          <p className="font-mono-num tabular-nums text-2xl font-bold text-[#231715] flex items-center gap-1.5">
            <span>{currentSeller.rating.toFixed(1)}</span>
            <Star className="w-5 h-5 fill-[#D97706] text-[#D97706]" />
          </p>
          <span className="text-xs text-[#1F6E43]">
            {currentSeller.verified ? 'Verified Temple Artisan Badge' : 'Verification Pending Admin Review'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFE7DA] rounded-xl">
        {[
          { id: 'inventory', label: `Manage Inventory & Prices (${sellerProducts.length})` },
          { id: 'add-product', label: '+ Upload New Product' },
          { id: 'orders', label: `Manage Orders (${orders.length})` },
          { id: 'earnings', label: 'Earnings & Payout Ledger' },
          { id: 'reviews', label: `Customer Reviews (${sellerReviews.length})` },
          { id: 'register', label: 'Seller Onboarding Form' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#FFFDF9] text-[#5B1818] shadow-xs'
                : 'text-[#5A493E] hover:text-[#231715]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Inventory & Inline Price/Stock Manager */}
      {activeTab === 'inventory' && (
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#EFE7DA] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-[#231715]">
                Live Product Inventory — {currentSeller.shopName}
              </h2>
              <p className="text-xs text-[#6E5A4F]">
                Adjust selling price (₹) or stock count below; updates reflect immediately in the customer storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('add-product')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85A17] text-white text-xs font-semibold hover:bg-[#B04B0E]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#6E5A4F] border-b border-[#EFE7DA]">
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Category · Tradition</th>
                  <th className="py-3.5 px-4 font-semibold">Selling Price (₹)</th>
                  <th className="py-3.5 px-4 font-semibold">Stock Available</th>
                  <th className="py-3.5 px-4 font-semibold">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7DA]">
                {sellerProducts.map((item) => (
                  <InventoryRow
                    key={item.id}
                    item={item}
                    onSave={onUpdateProductPriceStock}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Upload New Product */}
      {activeTab === 'add-product' && (
        <form
          onSubmit={handleCreateProduct}
          className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-[#EFE7DA] pb-4">
            <h2 className="font-display text-2xl font-bold text-[#231715]">
              Upload New Sacred Product to Bhakti Bazaar
            </h2>
            <p className="text-xs text-[#6E5A4F]">
              Listing under vendor: <strong>{currentSeller.shopName}</strong> ({currentSeller.city})
            </p>
          </div>

          {prodAddedBanner && (
            <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#ABEFC6] text-xs font-semibold text-[#1F6E43] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Product published live to the Bhakti Bazaar Storefront!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#231715]">
                Product Title (English) *
              </label>
              <input
                type="text"
                required
                value={prodNameEn}
                onChange={(e) => setProdNameEn(e.target.value)}
                placeholder="e.g., Hand-Carved Vrindavan Kadamba Wood Krishna Flute"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#231715]">
                Product Title (Hindi / देवनागरी)
              </label>
              <input
                type="text"
                value={prodNameHi}
                onChange={(e) => setProdNameHi(e.target.value)}
                placeholder="e.g., वृंदावन कदंब काष्ठ हस्तनिर्मित बांसुरी"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#231715]">
                Select Category (All 18 Devotional Categories) *
              </label>
              <select
                value={prodCategory}
                onChange={(e) => setProdCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.number}. {cat.nameEn} ({cat.nameHi})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#231715]">
                Devotional Community / Deity Tradition *
              </label>
              <select
                value={prodTradition}
                onChange={(e) => setProdTradition(e.target.value as TraditionId)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
              >
                {TRADITIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.labelEn} — {t.labelHi}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#231715]">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono-num bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#231715]">
                  MRP (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={prodOriginalPrice}
                  onChange={(e) => setProdOriginalPrice(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono-num bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#231715]">
                  Initial Stock *
                </label>
                <input
                  type="number"
                  required
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-mono-num bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#231715]">
                  Material & Purity
                </label>
                <input
                  type="text"
                  value={prodMaterial}
                  onChange={(e) => setProdMaterial(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#231715]">
                  Dham / City of Origin
                </label>
                <input
                  type="text"
                  value={prodOrigin}
                  onChange={(e) => setProdOrigin(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#231715]">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={prodSizes}
                onChange={(e) => setProdSizes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#231715]">
                Available Variations (comma-separated)
              </label>
              <input
                type="text"
                value={prodVariations}
                onChange={(e) => setProdVariations(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
              />
            </div>
          </div>

          {/* Image Upload & Studio Preset Picker */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-[#231715]">
              Product Photography (Upload File or Choose Studio Preset)
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-28 aspect-[4/3] rounded-lg overflow-hidden border border-[#DED4C6] bg-[#F3ECE1]">
                <SacredImage src={prodImage} alt="Preview" />
              </div>

              <label className="px-4 py-2.5 rounded-lg border border-[#5B1818] text-xs font-semibold text-[#5B1818] hover:bg-[#FAF7F2] cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Upload Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                {Object.entries(GENERATED_IMAGES).map(([key, url]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setProdImage(url)}
                    className={`w-14 aspect-[4/3] rounded border overflow-hidden ${
                      prodImage === url ? 'border-[#C85A17] ring-2 ring-[#C85A17]/40' : 'border-[#DED4C6]'
                    }`}
                  >
                    <SacredImage src={url} alt={key} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#231715]">
              Detailed Product Description & Seva Significance
            </label>
            <textarea
              rows={3}
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              placeholder="Describe the craftsmanship, spiritual significance, and care instructions..."
              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#5B1818] hover:bg-[#7A2020] text-white text-xs font-semibold"
          >
            Publish Product to Marketplace
          </button>
        </form>
      )}

      {/* Tab 3: Order Fulfillment */}
      {activeTab === 'orders' && (
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#231715]">
            Vendor Order Fulfillment Queue
          </h2>
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
                    <span className="text-[#6E5A4F]">
                      {ord.city} ({ord.pincode})
                    </span>
                  </div>
                  <p className="text-[#6E5A4F]">
                    {ord.items.map((i) => `${i.quantity}x ${i.nameEn}`).join(', ')}
                  </p>
                  <p className="text-[#9A3412] font-medium">
                    Payment: {ord.paymentMethod} ({ord.paymentStatus}) · Total:{' '}
                    <span className="font-mono-num">₹{ord.total.toLocaleString('en-IN')}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C85A17]" />
                  <select
                    value={ord.orderStatus}
                    onChange={(e) =>
                      onUpdateOrderStatus(
                        ord.id,
                        e.target.value as OrderRecord['orderStatus']
                      )
                    }
                    className="px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED4C6] text-xs font-semibold text-[#231715]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed at Vrindavan Hub">Packed at Vrindavan Hub</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Arrived at Hub">Arrived at Hub</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Earnings & Settlement Ledger */}
      {activeTab === 'earnings' && (
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#231715]">
                Earnings & Bank Settlement Ledger
              </h2>
              <p className="text-xs text-[#6E5A4F]">
                GSTIN: <span className="font-mono-num">{currentSeller.gstNumber}</span> · 94% Artisan Payout Share
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6E5A4F]">Available Balance</span>
              <p className="font-mono-num text-xl font-bold text-[#1F6E43]">
                ₹{currentSeller.balance.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tabular-nums">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#6E5A4F] border-b border-[#EFE7DA]">
                  <th className="py-3 px-4">Settlement Ref</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Gross Order Value</th>
                  <th className="py-3 px-4">Platform Seva Fee (6%)</th>
                  <th className="py-3 px-4">Net Artisan Payout</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE7DA]">
                <tr>
                  <td className="py-3 px-4 font-mono-num font-semibold">NEFT-BB-88210</td>
                  <td className="py-3 px-4">25 Oct – 01 Nov 2026</td>
                  <td className="py-3 px-4 font-mono-num">₹78,400</td>
                  <td className="py-3 px-4 font-mono-num">₹4,704</td>
                  <td className="py-3 px-4 font-mono-num font-bold text-[#1F6E43]">₹73,696</td>
                  <td className="py-3 px-4 text-[#1F6E43] font-medium">Settled to SBI A/c</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono-num font-semibold">NEFT-BB-87904</td>
                  <td className="py-3 px-4">18 Oct – 24 Oct 2026</td>
                  <td className="py-3 px-4 font-mono-num">₹1,17,876</td>
                  <td className="py-3 px-4 font-mono-num">₹7,072</td>
                  <td className="py-3 px-4 font-mono-num font-bold text-[#1F6E43]">₹1,10,804</td>
                  <td className="py-3 px-4 text-[#1F6E43] font-medium">Settled to SBI A/c</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Customer Reviews Monitor */}
      {activeTab === 'reviews' && (
        <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-[#231715]">
            Devotee Feedback & Product Reviews
          </h2>
          {sellerReviews.length === 0 ? (
            <p className="text-xs text-[#6E5A4F]">
              All reviews submitted on your products appear here in real time.
            </p>
          ) : (
            <div className="divide-y divide-[#EFE7DA] space-y-3">
              {sellerReviews.map((r) => (
                <div key={r.id} className="pt-3 first:pt-0 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#5B1818]">{r.productName}</span>
                    <span className="font-mono-num text-[#6E5A4F]">{r.date}</span>
                  </div>
                  <p className="text-[#231715] font-medium">
                    {r.author} ({r.location}) — {r.rating} ★
                  </p>
                  <p className="text-[#4A3B32]">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: New Vendor Registration Form */}
      {activeTab === 'register' && (
        <form
          onSubmit={handleRegisterSubmit}
          className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-5 max-w-2xl"
        >
          <div>
            <h2 className="font-display text-2xl font-bold text-[#231715]">
              Register as a Verified Temple Artisan or Devotional Seller
            </h2>
            <p className="text-xs text-[#6E5A4F]">
              Join sellers from Vrindavan, Mathura, Mayapur, Varanasi, Ayodhya, and Tirupati.
            </p>
          </div>

          {regSuccess && (
            <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#ABEFC6] text-xs text-[#1F6E43] font-medium">
              Application submitted! You can now switch to your vendor profile or approve the Verified Badge in the Admin Console.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={regShopName}
              onChange={(e) => setRegShopName(e.target.value)}
              placeholder="Shop / Kendra Name (e.g., Braj Bansi Shringar)"
              className="px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
            />
            <input
              type="text"
              required
              value={regOwnerName}
              onChange={(e) => setRegOwnerName(e.target.value)}
              placeholder="Artisan / Proprietor Full Name"
              className="px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
            />
            <input
              type="text"
              required
              value={regCity}
              onChange={(e) => setRegCity(e.target.value)}
              placeholder="Holy City & State (e.g., Vrindavan, UP)"
              className="px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
            />
            <input
              type="text"
              value={regGst}
              onChange={(e) => setRegGst(e.target.value)}
              placeholder="GSTIN / Craft Artisan Card No."
              className="px-3.5 py-2.5 text-xs font-mono-num bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
            />
          </div>
          <input
            type="text"
            required
            value={regSpecialty}
            onChange={(e) => setRegSpecialty(e.target.value)}
            placeholder="Primary Craft Specialty (e.g., Original Tulsi Malas, Brass Murtis, Zari Poshak)"
            className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#5B1818] text-white text-xs font-semibold hover:bg-[#7A2020]"
          >
            Submit Vendor Registration
          </button>
        </form>
      )}
    </div>
  );
};

const InventoryRow: React.FC<{
  item: ProductItem;
  onSave: (id: string, price: number, stock: number) => void;
}> = ({ item, onSave }) => {
  const [price, setPrice] = useState(item.price.toString());
  const [stock, setStock] = useState(item.stockCount.toString());
  const [saved, setSaved] = useState(false);

  const handleUpdate = () => {
    onSave(item.id, Math.max(1, Number(price) || item.price), Math.max(0, Number(stock) || 0));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <tr className="hover:bg-[#FAF7F2]/60">
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-9 rounded overflow-hidden bg-[#F3ECE1] border border-[#E6DDD0] shrink-0">
            <SacredImage src={item.image} alt={item.nameEn} />
          </div>
          <div>
            <p className="font-semibold text-[#231715] line-clamp-1 max-w-xs">{item.nameEn}</p>
            <p className="font-mono-num text-[11px] text-[#8C7A6B]">SKU: {item.sku}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4 text-[#6E5A4F]">
        {item.categoryNameEn} · {item.traditionLabel}
      </td>
      <td className="py-3.5 px-4">
        <div className="inline-flex items-center gap-1">
          <IndianRupee className="w-3 h-3 text-[#6E5A4F]" />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 px-2 py-1 rounded border border-[#DED4C6] bg-white font-mono-num text-xs"
          />
        </div>
      </td>
      <td className="py-3.5 px-4">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-20 px-2 py-1 rounded border border-[#DED4C6] bg-white font-mono-num text-xs"
        />
      </td>
      <td className="py-3.5 px-4">
        <button
          type="button"
          onClick={handleUpdate}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            saved ? 'bg-[#1F6E43] text-white' : 'bg-[#EFE7DA] text-[#5B1818] hover:bg-[#E2D5C1]'
          }`}
        >
          {saved ? 'Saved ✓' : 'Update'}
        </button>
      </td>
    </tr>
  );
};
