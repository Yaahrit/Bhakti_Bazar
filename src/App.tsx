/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Globe,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  User,
  X,
} from 'lucide-react';
import {
  CATEGORIES,
  CouponItem,
  FESTIVALS,
  FestivalId,
  GENERATED_IMAGES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
  Language,
  OrderItemRecord,
  OrderRecord,
  PINCODE_DIRECTORY,
  ProductItem,
  ProductReview,
  SellerProfile,
  TRADITIONS,
  TraditionId,
} from './data/marketplaceData';
import { SacredImage, SacredMotifIcon } from './components/SacredImage';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import {
  CheckoutAndTrackingView,
  SavedAddress,
} from './components/CheckoutAndTrackingView';
import { SellerDashboardView } from './components/SellerDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { MarketplaceDrawers, UserSession } from './components/MarketplaceDrawers';

type ScreenView =
  | 'storefront'
  | 'product-detail'
  | 'checkout'
  | 'tracking'
  | 'seller-dashboard'
  | 'admin-dashboard';

type CollectionFilter =
  | 'all'
  | 'bestseller'
  | 'new-arrival'
  | 'vrindavan-special'
  | 'iskcon-special'
  | 'mata-rani-special'
  | 'starter-kit';

export default function App() {
  // Global State
  const [language, setLanguage] = useState<Language>('en');
  const [activeView, setActiveView] = useState<ScreenView>('storefront');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [sellers, setSellers] = useState<SellerProfile[]>(INITIAL_SELLERS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);

  // User, Cart, Wishlist, Addresses
  const [user, setUser] = useState<UserSession | null>(null);
  const [cartItems, setCartItems] = useState<OrderItemRecord[]>([
    {
      productId: 'prod-1',
      nameEn: INITIAL_PRODUCTS[0].nameEn,
      nameHi: INITIAL_PRODUCTS[0].nameHi,
      size: INITIAL_PRODUCTS[0].sizes[1],
      variation: INITIAL_PRODUCTS[0].variations[0],
      quantity: 1,
      unitPrice: INITIAL_PRODUCTS[0].price,
      image: INITIAL_PRODUCTS[0].image,
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-3', 'prod-18']);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      label: 'Home Mandir',
      fullName: 'Anपणा Kulkarni',
      phone: '+91 98230 44120',
      line1: '402, Tulsi Vihar Apartments, Karve Road, Kothrud',
      city: 'Pune, Maharashtra',
      pincode: '411038',
    },
  ]);

  // Active PDP Product & Drawers
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(INITIAL_PRODUCTS[0]);
  const [activeDrawer, setActiveDrawer] = useState<
    'none' | 'cart' | 'wishlist' | 'auth' | 'support'
  >('none');

  // Storefront Search, Filters & Pincode
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTradition, setSelectedTradition] = useState<TraditionId>('all');
  const [selectedCollection, setSelectedCollection] = useState<CollectionFilter>('all');
  const [selectedFestival, setSelectedFestival] = useState<FestivalId>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>(
    'popular'
  );
  const [activePincode, setActivePincode] = useState<string>('281121');
  const [showAllCategories, setShowAllCategories] = useState<boolean>(true);

  // Admin-editable Hero Campaign Banner
  const [heroBannerConfig, setHeroBannerConfig] = useState({
    kickerEn: 'Sri Vrindavan & All-India Sanctified Marketplace',
    kickerHi: 'श्री वृंदावन एवं अखिल भारतीय प्रामाणिक भक्ति बाज़ार',
    headlineEn: 'हर भक्त की भक्ति का हर सामान, एक ही स्थान पर।',
    headlineHi: 'हर भक्त की भक्ति का हर सामान, एक ही स्थान पर।',
    announcementEn:
      'Kartik & Festival Seva Special: Use code RADHE10 for 10% off · Free Sanctified Delivery above ₹499',
    announcementHi:
      'कार्तिक एवं उत्सव सेवा विशेष: कूपन RADHE10 से १०% की छूट · ₹499 से ऊपर निःशुल्क डिलीवरी',
  });

  // Search Autocomplete Suggestions
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.nameEn.toLowerCase().includes(q) ||
          p.nameHi.toLowerCase().includes(q) ||
          p.categoryNameEn.toLowerCase().includes(q) ||
          p.traditionLabel.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery, products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
        if (selectedTradition !== 'all' && p.tradition !== selectedTradition) return false;
        if (
          selectedCollection !== 'all' &&
          !p.collectionTags.includes(selectedCollection)
        ) {
          return false;
        }
        if (selectedFestival !== 'all' && !p.festivals.includes(selectedFestival)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const match =
            p.nameEn.toLowerCase().includes(q) ||
            p.nameHi.toLowerCase().includes(q) ||
            p.categoryNameEn.toLowerCase().includes(q) ||
            p.categoryNameHi.toLowerCase().includes(q) ||
            p.traditionLabel.toLowerCase().includes(q) ||
            p.shortDescEn.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      });
  }, [
    products,
    selectedCategory,
    selectedTradition,
    selectedCollection,
    selectedFestival,
    searchQuery,
    sortBy,
  ]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handlers
  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setActiveView('product-detail');
    setShowSuggestions(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    product: ProductItem,
    size: string,
    variation: string,
    qty: number
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.variation === variation
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          nameEn: product.nameEn,
          nameHi: product.nameHi,
          size,
          variation,
          quantity: qty,
          unitPrice: product.price,
          image: product.image,
        },
      ];
    });
  };

  const handleBuyNow = (
    product: ProductItem,
    size: string,
    variation: string,
    qty: number
  ) => {
    handleAddToCart(product, size, variation, qty);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const nextQty = updated[index].quantity + delta;
      if (nextQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], quantity: nextQty };
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddReview = (
    productId: string,
    review: Omit<ProductReview, 'id' | 'date'>
  ) => {
    const newRev: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedProduct = {
          ...p,
          reviews: [newRev, ...p.reviews],
          reviewCount: p.reviewCount + 1,
        };
        if (selectedProduct.id === productId) {
          setSelectedProduct(updatedProduct);
        }
        return updatedProduct;
      })
    );
  };

  const handlePlaceOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    pincode: string;
    discount: number;
    paymentMethod: 'UPI' | 'CARD' | 'COD';
    paymentStatus:
      | 'Awaiting Verification'
      | 'Authorized (Sandbox)'
      | 'Pay on Delivery (COD)';
    paymentReference?: string;
  }): OrderRecord => {
    const subtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shippingFee = subtotal >= 499 ? 0 : 60;
    const total = Math.max(0, subtotal - orderData.discount + shippingFee);
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 4);

    const newOrder: OrderRecord = {
      id: `BB-ORD-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      city: orderData.city,
      pincode: orderData.pincode,
      items: [...cartItems],
      subtotal,
      discount: orderData.discount,
      shippingFee,
      total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      paymentReference: orderData.paymentReference,
      orderStatus: 'Confirmed',
      estimatedDelivery: estDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      courierPartner: 'Braj Express Air Priority',
      awbNumber: `BRJ-${Math.floor(100000000 + Math.random() * 899999999)}IN`,
      trackingSteps: (() => {
        const fmtDate = (offsetDays: number) => {
          const d = new Date();
          d.setDate(d.getDate() + offsetDays);
          return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        };
        const nowTime = new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return [
          {
            id: `evt-${Date.now()}-1`,
            stage: 'Order Placed',
            title: 'Order Confirmed & Seva Slip Generated',
            titleHi: 'ऑर्डर की पुष्टि एवं सेवा पर्ची तैयार',
            description: 'Order verified and assigned to Vrindavan temple artisans.',
            location: 'Loi Bazaar Dispatch Sanctuary, Vrindavan',
            date: fmtDate(0),
            time: nowTime,
            timestamp: `${fmtDate(0)} · ${nowTime}`,
            completed: true,
            current: true,
            hubCode: 'VRN-01',
          },
          {
            id: `evt-${Date.now()}-2`,
            stage: 'Sanctified & Packed',
            title: 'Sanctified Inspection & Protective Packaging',
            titleHi: 'पवित्र निरीक्षण एवं सुरक्षित पैकेजिंग',
            description: 'Items cushioned in tamper-evident box with sacred Braj Raj.',
            location: 'Raman Reti Packaging Kendra, Vrindavan',
            date: fmtDate(1),
            time: 'Scheduled 11:00 AM',
            timestamp: `${fmtDate(1)} · Scheduled`,
            completed: false,
            hubCode: 'VRN-PK',
          },
          {
            id: `evt-${Date.now()}-3`,
            stage: 'Dispatched from Dham',
            title: 'Dispatched from Mathura Regional Gateway',
            titleHi: 'मथुरा क्षेत्रीय केंद्र से रवाना',
            description: 'Handed over to Braj Express line-haul carrier.',
            location: 'Mathura Junction Hub, Uttar Pradesh',
            date: fmtDate(1),
            time: 'Scheduled 06:00 PM',
            timestamp: `${fmtDate(1)} · Scheduled`,
            completed: false,
            hubCode: 'MTJ-HUB',
          },
          {
            id: `evt-${Date.now()}-4`,
            stage: 'Arrived at Hub',
            title: `Arrived at Hub — ${orderData.city.split(',')[0]} Sort Facility`,
            titleHi: 'गंतव्य शहर वितरण केंद्र (हब) पर पहुंचा',
            description: 'Sorted at destination regional hub for final doorstep route.',
            location: `${orderData.city} Distribution Hub`,
            date: fmtDate(3),
            time: 'Estimated',
            timestamp: `${fmtDate(3)} · Estimated`,
            completed: false,
            hubCode: `HUB-${orderData.pincode.slice(0, 3)}`,
          },
          {
            id: `evt-${Date.now()}-5`,
            stage: 'Out for Delivery',
            title: 'Out for Doorstep Delivery',
            titleHi: 'डिलीवरी के लिए निकला (Out for Delivery)',
            description: 'Delivery partner assigned for final doorstep handover.',
            location: `Local Delivery Center — Pincode ${orderData.pincode}`,
            date: fmtDate(4),
            time: 'Morning Slot',
            timestamp: `${fmtDate(4)} · Morning Slot`,
            completed: false,
            hubCode: `DLV-${orderData.pincode.slice(-3)}`,
          },
          {
            id: `evt-${Date.now()}-6`,
            stage: 'Delivered',
            title: 'Delivered to Devotee Sanctuary',
            titleHi: 'भक्त के पते पर सफलतापूर्वक वितरित',
            description: 'Package delivered with devotee verification.',
            location: `${orderData.city} — ${orderData.pincode}`,
            date: fmtDate(4),
            time: 'By 07:00 PM',
            timestamp: `${fmtDate(4)} · By 07:00 PM`,
            completed: false,
            hubCode: `DEST-${orderData.pincode}`,
          },
        ];
      })(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    return newOrder;
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedTradition('all');
    setSelectedCollection('all');
    setSelectedFestival('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231715]">
      {/* Slim Dismissible Promotional Top Strip (<= 36px height) */}
      <div className="bg-[#421010] text-[#F9EFE3] text-xs py-2 px-4 text-center border-b border-[#5B1818]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
          <span className="hidden sm:inline text-[#E4C9A8]">
            ॐ नमो भगवते वासुदेवाय · वृंदावन धाम से सीधे आपके द्वार
          </span>
          <span className="mx-auto sm:mx-0 font-medium truncate">
            {language === 'hi'
              ? heroBannerConfig.announcementHi
              : heroBannerConfig.announcementEn}
          </span>
          <button
            type="button"
            onClick={() => setActiveDrawer('support')}
            className="hidden md:inline-flex items-center gap-1 text-[#F6C453] hover:underline whitespace-nowrap shrink-0"
          >
            <span>WhatsApp Seva Desk</span>
          </button>
        </div>
      </div>

      {/* Mandatory 3-Zone Top Bar Contract (<header>) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DDD0]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#5B1818] whitespace-nowrap shrink-0"
          >
            Bhakti Bazaar
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A3B32]">
            <button
              type="button"
              onClick={() => {
                setActiveView('storefront');
                resetFilters();
              }}
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'storefront'
                  ? 'text-[#5B1818] underline underline-offset-8 decoration-[#C85A17] decoration-2'
                  : ''
              }`}
            >
              {language === 'hi' ? 'मुख्य बाज़ार' : 'Storefront'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('storefront');
                const el = document.getElementById('categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'hi' ? '१८ श्रेणियाँ' : '18 Categories'}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('tracking')}
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'tracking'
                  ? 'text-[#5B1818] underline underline-offset-8 decoration-[#C85A17] decoration-2'
                  : ''
              }`}
            >
              {language === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Order'}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('seller-dashboard')}
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'seller-dashboard'
                  ? 'text-[#5B1818] underline underline-offset-8 decoration-[#C85A17] decoration-2'
                  : ''
              }`}
            >
              {language === 'hi' ? 'विक्रेता पोर्टल' : 'Seller Portal'}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('admin-dashboard')}
              className={`hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'admin-dashboard'
                  ? 'text-[#5B1818] underline underline-offset-8 decoration-[#C85A17] decoration-2'
                  : ''
              }`}
            >
              {language === 'hi' ? 'एडमिन कंसोल' : 'Admin Console'}
            </button>
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveDrawer('cart')}
              className="px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#5B1818] rounded-lg hover:bg-[#7A2020] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#F6C453]" />
              <span>
                {language === 'hi' ? 'पूजा टोकरी' : 'Cart'} ({totalCartCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Workspace Utility Bar (Search, Location/Delivery, Hindi/English, Wishlist, Account, Mobile View Switcher) */}
      <div className="bg-[#F4EFE6] border-b border-[#E6DDD0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Search Bar with Live Product & Deity Suggestions */}
          <div className="relative flex-1 min-w-[240px] max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  if (activeView !== 'storefront') setActiveView('storefront');
                }}
                placeholder={
                  language === 'hi'
                    ? 'तुलसी माला, लड्डू गोपाल, गोपी चंदन, इस्कॉन या माता चुनरी खोजें...'
                    : 'Search Tulsi Mala, Laddu Gopal, Gopi Chandan, Rudraksha, Gita...'
                }
                className="w-full pl-10 pr-9 py-2 text-xs bg-[#FFFDF9] border border-[#DED4C6] rounded-lg focus:outline-none focus:border-[#C85A17] text-[#231715]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-2.5 text-[#8C7A6B] hover:text-[#231715]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#FFFDF9] border border-[#DED4C6] rounded-xl shadow-xl z-30 divide-y divide-[#EFE7DA] overflow-hidden">
                {searchSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectProduct(item)}
                    className="w-full px-4 py-2.5 text-left hover:bg-[#FAF7F2] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-8 rounded overflow-hidden bg-[#F3ECE1] shrink-0">
                        <SacredImage src={item.image} alt={item.nameEn} />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-[#231715] truncate">
                          {language === 'hi' ? item.nameHi : item.nameEn}
                        </p>
                        <p className="text-[11px] text-[#6E5A4F]">
                          {item.categoryNameEn} · {item.traditionLabel}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-num font-semibold text-[#5B1818] shrink-0">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Utility Controls: Location Pincode, Language Switch, Wishlist, Account, Support */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Location / Delivery Selector */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#DED4C6]">
              <MapPin className="w-3.5 h-3.5 text-[#C85A17]" />
              <select
                value={activePincode}
                onChange={(e) => setActivePincode(e.target.value)}
                aria-label="Select delivery city"
                className="bg-transparent font-medium text-[#231715] focus:outline-none text-xs"
              >
                {Object.entries(PINCODE_DIRECTORY).map(([pin, info]) => (
                  <option key={pin} value={pin}>
                    Deliver to {info.city.split(',')[0]} ({pin}) — {info.days}d
                  </option>
                ))}
              </select>
            </div>

            {/* Bilingual Language Toggle (Hindi / English) */}
            <button
              type="button"
              onClick={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#DED4C6] hover:border-[#C85A17] font-semibold text-[#5B1818] whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>{language === 'en' ? 'हिन्दी में देखें' : 'Switch to English'}</span>
            </button>

            {/* Wishlist Trigger */}
            <button
              type="button"
              onClick={() => setActiveDrawer('wishlist')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#DED4C6] hover:border-[#C85A17] font-medium text-[#231715] whitespace-nowrap shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-[#B42318]" />
              <span>
                {language === 'hi' ? 'पसंदीदा' : 'Wishlist'} ({wishlistIds.length})
              </span>
            </button>

            {/* User / Google Login Trigger */}
            <button
              type="button"
              onClick={() => setActiveDrawer('auth')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#DED4C6] hover:border-[#C85A17] font-medium text-[#231715] whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5 text-[#5B1818]" />
              <span>
                {user
                  ? user.name.split(' ')[0]
                  : language === 'hi'
                  ? 'लॉगिन / गूगल'
                  : 'Sign In'}
              </span>
            </button>

            {/* Mobile Quick Navigation Pills */}
            <div className="flex md:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveView('seller-dashboard')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#DED4C6] font-medium"
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => setActiveView('admin-dashboard')}
                className="px-2.5 py-1.5 rounded-lg bg-[#FFFDF9] border border-[#DED4C6] font-medium"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'product-detail' && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            language={language}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            defaultPincode={activePincode}
            onBack={() => setActiveView('storefront')}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            onAddReview={handleAddReview}
          />
        )}

        {(activeView === 'checkout' || activeView === 'tracking') && (
          <CheckoutAndTrackingView
            mode={activeView}
            language={language}
            cartItems={cartItems}
            coupons={coupons}
            orders={orders}
            savedAddresses={savedAddresses}
            onAddAddress={(newAddr) =>
              setSavedAddresses((prev) => [
                ...prev,
                { ...newAddr, id: `addr-${Date.now()}` },
              ])
            }
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveCartItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            onBackToStore={() => setActiveView('storefront')}
          />
        )}

        {activeView === 'seller-dashboard' && (
          <SellerDashboardView
            language={language}
            sellers={sellers}
            products={products}
            orders={orders}
            onRegisterSeller={(newSeller) => {
              setSellers((prev) => [
                ...prev,
                {
                  ...newSeller,
                  id: `seller-${Date.now()}`,
                  verified: false,
                  status: 'pending',
                  joinedDate: new Date().toISOString().slice(0, 10),
                  rating: 5.0,
                  totalSales: 0,
                  balance: 0,
                },
              ]);
            }}
            onAddProduct={(newProd) => setProducts((prev) => [newProd, ...prev])}
            onUpdateProductPriceStock={(id, newPrice, newStock) => {
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === id
                    ? { ...p, price: newPrice, stockCount: newStock, inStock: newStock > 0 }
                    : p
                )
              );
            }}
            onUpdateOrderStatus={(orderId, newStatus) => {
              const statusLevelMap: Record<OrderRecord['orderStatus'], number> = {
                Confirmed: 1,
                'Packed at Vrindavan Hub': 2,
                'In Transit': 3,
                'Arrived at Hub': 4,
                'Out for Delivery': 5,
                Delivered: 6,
              };
              const targetCount = statusLevelMap[newStatus] || 1;
              setOrders((prev) =>
                prev.map((o) => {
                  if (o.id !== orderId) return o;
                  const updatedSteps = o.trackingSteps.map((step, idx) => ({
                    ...step,
                    completed: idx < targetCount,
                    current: idx === targetCount - 1,
                  }));
                  return {
                    ...o,
                    orderStatus: newStatus,
                    trackingSteps: updatedSteps,
                  };
                })
              );
            }}
          />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboardView
            language={language}
            products={products}
            sellers={sellers}
            orders={orders}
            coupons={coupons}
            heroBannerConfig={heroBannerConfig}
            onToggleSellerApproval={(sellerId) => {
              setSellers((prev) =>
                prev.map((s) =>
                  s.id === sellerId
                    ? {
                        ...s,
                        verified: !s.verified,
                        status: !s.verified ? 'approved' : 'pending',
                      }
                    : s
                )
              );
              setProducts((prev) =>
                prev.map((p) =>
                  p.sellerId === sellerId
                    ? { ...p, verifiedSeller: !p.verifiedSeller }
                    : p
                )
              );
            }}
            onDeleteProduct={(productId) =>
              setProducts((prev) => prev.filter((p) => p.id !== productId))
            }
            onToggleBestseller={(productId) =>
              setProducts((prev) =>
                prev.map((p) => {
                  if (p.id !== productId) return p;
                  const exists = p.collectionTags.includes('bestseller');
                  return {
                    ...p,
                    collectionTags: exists
                      ? p.collectionTags.filter((t) => t !== 'bestseller')
                      : [...p.collectionTags, 'bestseller'],
                  };
                })
              )
            }
            onCreateCoupon={(newCoupon) =>
              setCoupons((prev) => [newCoupon, ...prev])
            }
            onToggleCoupon={(code) =>
              setCoupons((prev) =>
                prev.map((c) =>
                  c.code === code ? { ...c, active: !c.active } : c
                )
              )
            }
            onUpdateHeroBanner={(cfg) => setHeroBannerConfig(cfg)}
            onVerifyOrderPayment={(orderId) =>
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === orderId
                    ? { ...o, paymentStatus: 'Authorized (Sandbox)' }
                    : o
                )
              )
            }
          />
        )}

        {/* STOREFRONT VIEW */}
        {activeView === 'storefront' && (
          <div className="space-y-16 pb-16">
            {/* SECTION 1: Radha Krishna Sanctuary Hero Banner + 4-Column Provenance Strip */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden border border-[#DECBB4] bg-[#2B110F] text-[#FAF7F2] items-stretch">
                {/* Left 6 Columns: Editorial Narrative & Direct Collection Route */}
                <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <p className="text-xs font-medium tracking-wider text-[#F6C453]">
                      {language === 'hi'
                        ? heroBannerConfig.kickerHi
                        : heroBannerConfig.kickerEn}
                    </p>

                    <h1
                      className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.15] text-[#FFFDF9]"
                      style={{ textWrap: 'balance' }}
                    >
                      {language === 'hi'
                        ? heroBannerConfig.headlineHi
                        : heroBannerConfig.headlineEn}
                    </h1>

                    <p className="text-sm sm:text-base text-[#E6D5C3] leading-relaxed max-w-xl">
                      {language === 'hi'
                        ? 'श्री वृंदावन धाम की शुद्ध तुलसी कंठी व जप माला, अष्टधातु लड्डू गोपाल विग्रह, बांके बिहारी पोशाक, काशी रुद्राक्ष, माता रानी चुनरी एवं प्रामाणिक वैदिक ग्रंथ।'
                        : 'Every sacred essential for every devotee in one trusted sanctuary. Direct from artisan families of Sri Vrindavan, Mathura, Mayapur, Kashi, and Ayodhya.'}
                    </p>
                  </div>

                  {/* Primary Action + Secondary Collection Anchor */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCollection('vrindavan-special');
                          document
                            .getElementById('catalog-section')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-6 py-3 rounded-xl bg-[#C85A17] hover:bg-[#B04B0E] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>
                          {language === 'hi'
                            ? 'वृंदावन एवं ब्रज विशेष संग्रह देखें'
                            : 'Explore Vrindavan & Braj Collection'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCollection('starter-kit');
                          document
                            .getElementById('catalog-section')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#FFFDF9] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
                      >
                        {language === 'hi'
                          ? 'नव-भक्त जप एवं पूजा किट'
                          : 'Japa & Puja Starter Kits'}
                      </button>
                    </div>

                    {/* Unboxed Community Serve Line */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#D8C3AD]">
                      <span>Radha Krishna</span>
                      <span aria-hidden="true">·</span>
                      <span>ISKCON & Vaishnav</span>
                      <span aria-hidden="true">·</span>
                      <span>Lord Shiva</span>
                      <span aria-hidden="true">·</span>
                      <span>Rama & Hanuman</span>
                      <span aria-hidden="true">·</span>
                      <span>Mata Rani Shakti</span>
                    </div>
                  </div>
                </div>

                {/* Right 6 Columns: High-Resolution Radha Krishna Sanctuary Image */}
                <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px]">
                  <SacredImage
                    src={GENERATED_IMAGES.heroRadhaKrishna}
                    alt="Sri Sri Radha Krishna brass vigraha in a sunlit sandstone temple courtyard in Vrindavan"
                    className="w-full h-full lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B110F]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#2B110F]/45 lg:to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 sm:left-auto bg-[#231715]/85 backdrop-blur-xs border border-white/15 rounded-xl px-4 py-2.5 text-xs text-[#FAF7F2]">
                    <p className="font-display text-sm font-semibold text-[#F6C453]">
                      Sri Sri Radha Shyamsundar Shringar & Seva
                    </p>
                    <p className="text-[11px] text-[#E6D5C3]">
                      Handcrafted Ashtadhatu Idols · Loi Bazaar Vrindavan Tulsi · Pure Attar
                    </p>
                  </div>
                </div>
              </div>

              {/* Full-Width 4-Column Provenance & Trust Bar below the Hero Split */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl p-5 text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#231715]">
                    100% Authentic Dham Sourcing
                  </p>
                  <p className="text-[#6E5A4F]">
                    Direct from Loi Bazaar Vrindavan, Mayapur, Kashi & Moradabad artisans
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#231715]">
                    18 Complete Devotional Categories
                  </p>
                  <p className="text-[#6E5A4F]">
                    From 3-round Tulsi Kanthi Malas to tuned concert Khol Mridangas
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#231715]">
                    Sanctified Sattvic Packaging
                  </p>
                  <p className="text-[#6E5A4F]">
                    Packed in clean temple-grade boxes with Braj Raj & care guide
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#231715]">
                    COD, UPI & Pan-India Express
                  </p>
                  <p className="text-[#6E5A4F]">
                    Delivering across 19,000+ pincodes with live shipment tracking
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2: Shop by All 18 Product Categories & Devotional Tradition Filter */}
            <section
              id="categories-section"
              className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
            >
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E6DDD0] pb-4">
                <div>
                  <p className="text-xs font-semibold text-[#9A3412]">
                    {language === 'hi'
                      ? 'अष्टादश भक्ति विभाग (18 Sacred Categories)'
                      : 'Complete Devotional Taxonomy'}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#231715]">
                    {language === 'hi'
                      ? 'श्रेणी और संप्रदाय के अनुसार खरीदारी करें'
                      : 'Shop by Sacred Category & Tradition'}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {selectedCategory !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="text-xs font-semibold text-[#9A3412] hover:underline"
                    >
                      Clear Category Filter
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowAllCategories((prev) => !prev)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#DED4C6] bg-[#FFFDF9] text-xs font-semibold text-[#5B1818] hover:bg-[#FAF7F2] whitespace-nowrap shrink-0"
                  >
                    {showAllCategories
                      ? 'Compact View (Top 6)'
                      : `Show All 18 Categories`}
                  </button>
                </div>
              </div>

              {/* Interactive Devotional Community / Deity Tradition Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-[#EFE7DA] rounded-xl">
                {TRADITIONS.map((trad) => (
                  <button
                    key={trad.id}
                    type="button"
                    onClick={() => {
                      setSelectedTradition(trad.id);
                      document
                        .getElementById('catalog-section')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      selectedTradition === trad.id
                        ? 'bg-[#5B1818] text-[#FAF7F2] shadow-xs'
                        : 'text-[#4A3B32] hover:text-[#231715] hover:bg-[#FFFDF9]/60'
                    }`}
                  >
                    {language === 'hi' ? trad.labelHi : trad.labelEn}
                  </button>
                ))}
              </div>

              {/* 18 Categories Grid with Images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {(showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 6)).map(
                  (cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(
                            isSelected ? 'all' : cat.id
                          );
                          document
                            .getElementById('catalog-section')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`group text-left rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#C85A17] ring-2 ring-[#C85A17]/30 bg-[#FFFDF9]'
                            : 'border-[#E6DDD0] bg-[#FFFDF9] hover:border-[#C85A17]/60 hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="relative aspect-[4/3] w-full bg-[#F3ECE1] overflow-hidden">
                          <SacredImage
                            src={cat.image}
                            alt={cat.nameEn}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                          <span className="absolute bottom-2 left-2.5 font-mono-num text-[11px] font-medium text-[#FFFDF9]">
                            {String(cat.number).padStart(2, '0')} · {cat.itemCount} items
                          </span>
                        </div>
                        <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-1.5">
                            <h3 className="text-xs font-semibold text-[#231715] group-hover:text-[#9A3412] leading-snug line-clamp-2">
                              {language === 'hi' ? cat.nameHi : cat.nameEn}
                            </h3>
                            <SacredMotifIcon
                              motif={cat.motif}
                              className="w-3.5 h-3.5 text-[#C85A17] shrink-0 mt-0.5"
                            />
                          </div>
                          <p className="text-[11px] text-[#6E5A4F] line-clamp-1">
                            {language === 'hi' ? cat.subtitleHi : cat.subtitleEn}
                          </p>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* SECTION 3: Curated Marketplace Catalog (Best Selling, New Arrivals, Vrindavan, ISKCON, Mata Rani & Festival Filter) */}
            <section
              id="catalog-section"
              className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
            >
              {/* Collection Tabs Header */}
              <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#231715]">
                      {selectedCategory !== 'all'
                        ? CATEGORIES.find((c) => c.id === selectedCategory)?.[
                            language === 'hi' ? 'nameHi' : 'nameEn'
                          ]
                        : language === 'hi'
                        ? 'विशेष भक्ति संग्रह एवं सर्वाधिक लोकप्रिय उत्पाद'
                        : 'Featured Devotional Collections & Catalog'}
                    </h2>
                    <p className="text-xs text-[#6E5A4F]">
                      Showing <span className="font-mono-num font-semibold">{filteredProducts.length}</span>{' '}
                      authentic items · Direct artisan pricing in tabular INR
                    </p>
                  </div>

                  {/* Sort & Reset Controls */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    {(selectedCategory !== 'all' ||
                      selectedTradition !== 'all' ||
                      selectedCollection !== 'all' ||
                      selectedFestival !== 'all' ||
                      searchQuery) && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="px-3 py-2 rounded-lg bg-[#FEF3F2] text-[#B42318] font-semibold hover:bg-[#FEE4E2] whitespace-nowrap shrink-0"
                      >
                        Reset All Filters
                      </button>
                    )}

                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#DED4C6]">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#C85A17]" />
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as typeof sortBy)
                        }
                        aria-label="Sort products"
                        className="bg-transparent font-medium text-[#231715] focus:outline-none"
                      >
                        <option value="popular">Sort: Most Popular</option>
                        <option value="rating">Sort: Highest Rated</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Curated Collection Switcher Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-[#FAF7F2] border border-[#EFE7DA] rounded-xl">
                  {[
                    {
                      id: 'all',
                      labelEn: 'All Sacred Essentials',
                      labelHi: 'सभी उत्पाद',
                    },
                    {
                      id: 'bestseller',
                      labelEn: 'Best Selling Products',
                      labelHi: 'सर्वाधिक लोकप्रिय (Bestsellers)',
                    },
                    {
                      id: 'vrindavan-special',
                      labelEn: 'Vrindavan & Braj Special',
                      labelHi: 'वृंदावन एवं ब्रज विशेष',
                    },
                    {
                      id: 'iskcon-special',
                      labelEn: 'ISKCON Special Collection',
                      labelHi: 'इस्कॉन विशेष संग्रह',
                    },
                    {
                      id: 'mata-rani-special',
                      labelEn: 'Mata Rani Special Collection',
                      labelHi: 'माता रानी विशेष श्रृंगार',
                    },
                    {
                      id: 'starter-kit',
                      labelEn: 'New Devotee Combo & Starter Kits',
                      labelHi: 'नव-भक्त कॉम्बो एवं जप किट',
                    },
                    {
                      id: 'new-arrival',
                      labelEn: 'New Arrivals',
                      labelHi: 'नवीनतम संग्रह',
                    },
                  ].map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() =>
                        setSelectedCollection(col.id as CollectionFilter)
                      }
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        selectedCollection === col.id
                          ? 'bg-[#C85A17] text-white'
                          : 'text-[#5A493E] hover:text-[#231715]'
                      }`}
                    >
                      {language === 'hi' ? col.labelHi : col.labelEn}
                    </button>
                  ))}
                </div>

                {/* Festival Curation Filter Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EFE7DA] text-xs">
                  <span className="font-semibold text-[#5B1818] inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
                    {language === 'hi'
                      ? 'पर्व एवं उत्सव विशेष संग्रह:'
                      : 'Shop by Sacred Festival:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {FESTIVALS.map((fest) => (
                      <button
                        key={fest.id}
                        type="button"
                        onClick={() => setSelectedFestival(fest.id)}
                        className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                          selectedFestival === fest.id
                            ? 'bg-[#5B1818] text-white border-[#5B1818]'
                            : 'bg-white text-[#5A493E] border-[#DED4C6] hover:border-[#5B1818]'
                        }`}
                      >
                        {language === 'hi' ? fest.nameHi : fest.nameEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3-Column Product Grid (Desktop) / 2-Column (Tablet) */}
              {filteredProducts.length === 0 ? (
                <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-12 text-center space-y-3">
                  <p className="font-display text-2xl font-bold text-[#231715]">
                    No sacred items matched your current filter combination
                  </p>
                  <p className="text-xs text-[#6E5A4F]">
                    Try clearing one of your active category, tradition, or festival filters.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#5B1818] text-white text-xs font-semibold"
                  >
                    Show All {products.length} Sacred Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      language={language}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 4: Dedicated Vrindavan-Mathura Craft Provenance & Attributable Devotee Reviews */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left 5 Columns: Special Offers & Starter Combo Spotlight */}
                <div className="lg:col-span-5 bg-[#421010] text-[#FAF7F2] rounded-2xl p-8 flex flex-col justify-between space-y-6 border border-[#5B1818]">
                  <div className="space-y-3">
                    <span className="text-xs font-medium tracking-wider text-[#F6C453]">
                      {language === 'hi'
                        ? 'विशेष उत्सव उपहार एवं कॉम्बो'
                        : 'VRINDAVAN & ISKCON STARTER TRUNK'}
                    </span>
                    <h3 className="font-display text-3xl font-bold text-white leading-tight">
                      {language === 'hi'
                        ? 'नव-भक्त संपूर्ण जप एवं पूजा प्रारंभिक किट (10-in-1)'
                        : 'Beginning Your Daily Japa or Home Deity Seva?'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#E6D5C3] leading-relaxed">
                      Receive an authenticated 3-round Vrindavan Tulsi Kanthi Mala, 108-bead knotted Japa Mala, embroidered Gomukhi bag, Sakshi counter, Dwarka Gopi Chandan, brass Tilak stamp, Braj attar, and hardcover Bhagavad Gita in one sanctified box.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-white/15">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[#E4C9A8]">Combo Special Offer</span>
                      <span className="font-mono-num text-xl font-bold text-[#F6C453]">
                        ₹1,490 <span className="text-xs line-through text-[#C4A98B]">₹2,150</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const starterKit =
                          products.find((p) => p.id === 'prod-18') || products[0];
                        handleSelectProduct(starterKit);
                      }}
                      className="w-full py-3 px-5 rounded-xl bg-[#C85A17] hover:bg-[#B04B0E] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Inspect 10-in-1 Starter Kit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right 7 Columns: Attributable Devotee Testimonials (Adjacent to Provenance Claim) */}
                <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-8 flex flex-col justify-between space-y-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EFE7DA] pb-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#231715]">
                        {language === 'hi'
                          ? 'भक्तों के अनुभव (Devotee Voices)'
                          : 'Trusted by Devotees & Temple Communities'}
                      </h3>
                      <p className="text-xs text-[#6E5A4F]">
                        4.9 / 5 average rating across 14,200+ verified dispatches from Vrindavan & Mathura
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#1F6E43] inline-flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      100% Verified Orders
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-1 text-[#D97706]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-[#231715] leading-relaxed">
                        &ldquo;Before finding Bhakti Bazaar, our local stores only carried chemically dyed wooden beads sold as Tulsi. Switching to Brajwasi Kendra’s natural Loi Bazaar 3-round Kanthi and 10mm Japa Mala gave our entire congregation authentic Braj wood.&rdquo;
                      </p>
                      <div className="pt-1 text-[#6E5A4F]">
                        <p className="font-semibold text-[#231715]">
                          HG Radhika Raman Das
                        </p>
                        <p>Congregational Preacher · ISKCON Juhu, Mumbai</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-1 text-[#D97706]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-[#231715] leading-relaxed">
                        &ldquo;We ordered the Size No. 5 Ashtadhatu Laddu Gopal Vigraha and 7-piece Moradabad brass aarti thali for Janmashtami. The carving of Thakurji’s lotus eyes and the 12-second acoustic chime of the Garud bell exceeded every expectation.&rdquo;
                      </p>
                      <div className="pt-1 text-[#6E5A4F]">
                        <p className="font-semibold text-[#231715]">
                          Smt. Anपणा Kulkarni & Family
                        </p>
                        <p>Grihastha Devotee · Kothrud, Pune</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Comprehensive Footer with About Us, Contact, Policies, Category Links & Social Media */}
      <footer className="bg-[#231715] text-[#E6D5C3] border-t border-[#3E2723] mt-auto">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Col 1: Brand & Mission */}
            <div className="lg:col-span-4 space-y-3">
              <p className="font-display text-2xl font-bold text-[#FFFDF9]">
                Bhakti Bazaar
              </p>
              <p className="text-sm font-medium text-[#F6C453]">
                हर भक्त की भक्ति का हर सामान, एक ही स्थान पर।
              </p>
              <p className="text-xs text-[#C4B29F] leading-relaxed">
                India’s premier devotional marketplace connecting Radha Krishna, ISKCON Vaishnav, Shaiva, Ram Bhakta, and Shakti devotees directly with traditional artisans in Vrindavan, Mathura, Mayapur, Varanasi, and Moradabad.
              </p>
              <div className="pt-2 text-xs text-[#C4B29F] space-y-1">
                <p>
                  <strong className="text-[#FFFDF9]">Sri Vrindavan Sanctuary Hub:</strong>{' '}
                  Raman Reti Marg, Near Loi Bazaar, Vrindavan, Mathura (UP) — 281121
                </p>
                <p>
                  <strong className="text-[#FFFDF9]">Seva Helpline:</strong>{' '}
                  1800-108-1008 · seva@bhaktibazaar.in
                </p>
              </div>
            </div>

            {/* Col 2: Sacred Categories Quick Directory */}
            <div className="lg:col-span-3 space-y-2.5 text-xs">
              <p className="font-semibold text-[#FFFDF9] uppercase tracking-wider">
                Sacred Categories
              </p>
              <ul className="space-y-1.5 text-[#C4B29F]">
                {CATEGORIES.slice(0, 7).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('storefront');
                        setSelectedCategory(c.id);
                        window.scrollTo({ top: 450, behavior: 'smooth' });
                      }}
                      className="hover:text-[#F6C453] transition-colors text-left"
                    >
                      {c.nameEn}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: More Deities & Traditions */}
            <div className="lg:col-span-3 space-y-2.5 text-xs">
              <p className="font-semibold text-[#FFFDF9] uppercase tracking-wider">
                Idols, Puja & Kirtan
              </p>
              <ul className="space-y-1.5 text-[#C4B29F]">
                {CATEGORIES.slice(7, 14).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('storefront');
                        setSelectedCategory(c.id);
                        window.scrollTo({ top: 450, behavior: 'smooth' });
                      }}
                      className="hover:text-[#F6C453] transition-colors text-left"
                    >
                      {c.nameEn}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Policies, Portals & Support */}
            <div className="lg:col-span-2 space-y-2.5 text-xs">
              <p className="font-semibold text-[#FFFDF9] uppercase tracking-wider">
                Marketplace & Trust
              </p>
              <ul className="space-y-1.5 text-[#C4B29F]">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('tracking')}
                    className="hover:text-[#F6C453]"
                  >
                    Order Tracking & History
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('seller-dashboard')}
                    className="hover:text-[#F6C453]"
                  >
                    Artisan & Seller Registration
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveView('admin-dashboard')}
                    className="hover:text-[#F6C453]"
                  >
                    Admin Governance Console
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveDrawer('support')}
                    className="hover:text-[#F6C453]"
                  >
                    24x7 WhatsApp Seva Support
                  </button>
                </li>
                <li className="text-[#9E8C7A]">7-Day Sanctified Replacement Policy</li>
                <li className="text-[#9E8C7A]">100% Ahimsa & Cruelty-Free Sourcing</li>
                <li className="text-[#9E8C7A]">Privacy, Terms & GST Compliance</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9E8C7A]">
            <p>© {new Date().getFullYear()} Bhakti Bazaar Sanctuary Marketplace. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveDrawer('support')}
                className="inline-flex items-center gap-1.5 text-[#F6C453] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </button>
              <span>·</span>
              <span>UPI / RuPay / Visa / COD Supported</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Slide-Over Drawers for Cart, Wishlist, Auth & Support */}
      <MarketplaceDrawers
        language={language}
        activeDrawer={activeDrawer}
        onClose={() => setActiveDrawer('none')}
        cartItems={cartItems}
        wishlistIds={wishlistIds}
        allProducts={products}
        user={user}
        onLoginUser={(u) => setUser(u)}
        onLogoutUser={() => setUser(null)}
        onUpdateCartQty={handleUpdateCartQty}
        onRemoveCartItem={handleRemoveCartItem}
        onProceedToCheckout={() => setActiveView('checkout')}
        onMoveWishlistToCart={(prod) => {
          handleAddToCart(
            prod,
            prod.sizes[0] || 'Standard',
            prod.variations[0] || 'Default',
            1
          );
          handleToggleWishlist(prod.id);
        }}
        onRemoveWishlist={handleToggleWishlist}
      />
    </div>
  );
}
