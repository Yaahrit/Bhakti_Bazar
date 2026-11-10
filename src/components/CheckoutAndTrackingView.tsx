import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Plus,
  QrCode,
  ShieldCheck,
  Smartphone,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import {
  CouponItem,
  Language,
  OrderItemRecord,
  OrderRecord,
} from '../data/marketplaceData';
import { SacredImage } from './SacredImage';

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  pincode: string;
}

interface CheckoutAndTrackingViewProps {
  mode: 'checkout' | 'tracking';
  language: Language;
  cartItems: OrderItemRecord[];
  coupons: CouponItem[];
  orders: OrderRecord[];
  savedAddresses: SavedAddress[];
  onAddAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  onUpdateCartQty: (index: number, delta: number) => void;
  onRemoveCartItem: (index: number) => void;
  onPlaceOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    pincode: string;
    discount: number;
    paymentMethod: 'UPI' | 'CARD' | 'COD';
    paymentStatus: 'Awaiting Verification' | 'Authorized (Sandbox)' | 'Pay on Delivery (COD)';
    paymentReference?: string;
  }) => OrderRecord;
  onBackToStore: () => void;
}

export const CheckoutAndTrackingView: React.FC<CheckoutAndTrackingViewProps> = ({
  mode,
  language,
  cartItems,
  coupons,
  orders,
  savedAddresses,
  onAddAddress,
  onUpdateCartQty,
  onRemoveCartItem,
  onPlaceOrder,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'tracking'>(mode);

  // Address selection & new address state
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id || 'new'
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(savedAddresses.length === 0);
  const [addrLabel, setAddrLabel] = useState('Home Mandir');
  const [fullName, setFullName] = useState('Madhav Sharma');
  const [phone, setPhone] = useState('+91 98112 34560');
  const [email, setEmail] = useState('madhav.bhakti@example.com');
  const [line1, setLine1] = useState('B-42, Raman Reti Marg, Near ISKCON Temple');
  const [city, setCity] = useState('Vrindavan, Uttar Pradesh');
  const [pincode, setPincode] = useState('281121');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponItem | null>(null);
  const [couponMessage, setCouponMessage] = useState<string>('');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('COD');
  const [upiVpa, setUpiVpa] = useState('');
  const [upiUtr, setUpiUtr] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardConsent, setCardConsent] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Tracking state
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  React.useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 60;

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    discountAmount = Math.min(
      Math.round((subtotal * appliedCoupon.discountPercent) / 100),
      appliedCoupon.maxDiscount
    );
  }
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      setAppliedCoupon(null);
      setCouponMessage('Invalid or expired coupon code.');
      return;
    }
    if (subtotal < found.minOrder) {
      setAppliedCoupon(null);
      setCouponMessage(`Minimum order of ₹${found.minOrder} required for ${found.code}.`);
      return;
    }
    setAppliedCoupon(found);
    setCouponMessage(`Applied ${found.code}: ${found.discountPercent}% off!`);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !line1.trim() || !pincode.trim()) return;
    onAddAddress({
      label: addrLabel || 'Home',
      fullName: fullName.trim(),
      phone: phone.trim(),
      line1: line1.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    });
    setShowNewAddressForm(false);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');
    if (cartItems.length === 0) {
      setPaymentError('Your cart is empty. Please add sacred items before placing an order.');
      return;
    }

    const chosenAddr =
      savedAddresses.find((a) => a.id === selectedAddressId) || {
        fullName,
        phone,
        line1,
        city,
        pincode,
      };

    if (!chosenAddr.fullName || !chosenAddr.phone || !chosenAddr.line1 || !chosenAddr.pincode) {
      setPaymentError('Please complete all delivery address and contact verification fields.');
      return;
    }

    if (paymentMethod === 'UPI') {
      if (!upiVpa.includes('@') || upiUtr.trim().length < 6) {
        setPaymentError(
          'For UPI orders, please enter a valid UPI ID (containing @) and your 12-digit UPI/UTR Reference Number for verification.'
        );
        return;
      }
    }

    if (paymentMethod === 'CARD') {
      if (cardNumber.replace(/\s/g, '').length < 12 || !cardHolder.trim() || !cardConsent) {
        setPaymentError(
          'Please enter cardholder details and check the explicit authorization box to proceed.'
        );
        return;
      }
    }

    const paymentStatus =
      paymentMethod === 'COD'
        ? 'Pay on Delivery (COD)'
        : paymentMethod === 'UPI'
        ? 'Awaiting Verification'
        : 'Authorized (Sandbox)';

    const paymentReference =
      paymentMethod === 'UPI'
        ? `UPI VPA: ${upiVpa} · UTR: ${upiUtr}`
        : paymentMethod === 'CARD'
        ? `Card ending ${cardNumber.slice(-4)}`
        : 'Cash/UPI payable at doorstep';

    const createdOrder = onPlaceOrder({
      customerName: chosenAddr.fullName,
      customerPhone: chosenAddr.phone,
      customerEmail: email,
      shippingAddress: chosenAddr.line1,
      city: chosenAddr.city,
      pincode: chosenAddr.pincode,
      discount: discountAmount,
      paymentMethod,
      paymentStatus,
      paymentReference,
    });

    setSelectedOrderId(createdOrder.id);
    setActiveTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trackedOrder =
    orders.find(
      (o) =>
        o.id.toLowerCase() ===
        (searchOrderQuery.trim() || selectedOrderId).toLowerCase()
    ) || orders[0];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6DDD0]">
        <button
          type="button"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#5B1818] hover:text-[#9A3412] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'खरीदारी जारी रखें' : 'Continue Shopping'}</span>
        </button>

        <div className="flex items-center gap-1 p-1 bg-[#EFE7DA] rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('checkout')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'checkout'
                ? 'bg-[#FFFDF9] text-[#231715] shadow-xs'
                : 'text-[#6E5A4F] hover:text-[#231715]'
            }`}
          >
            {language === 'hi' ? 'सुरक्षित चेकआउट (Checkout)' : 'Secure Checkout & Addresses'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'tracking'
                ? 'bg-[#FFFDF9] text-[#231715] shadow-xs'
                : 'text-[#6E5A4F] hover:text-[#231715]'
            }`}
          >
            {language === 'hi'
              ? `ऑर्डर ट्रैकिंग एवं इतिहास (${orders.length})`
              : `Order Tracking & History (${orders.length})`}
          </button>
        </div>
      </div>

      {activeTab === 'checkout' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Address Management + Payment Verification */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Address Management */}
            <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#231715]">
                    {language === 'hi'
                      ? '1. डिलीवरी पता एवं भक्त सत्यापन'
                      : '1. Delivery Address & Verification'}
                  </h2>
                  <p className="text-xs text-[#6E5A4F]">
                    Sanctified packages are dispatched in tamper-evident protective boxes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DED4C6] text-xs font-semibold text-[#5B1818] hover:bg-[#FAF7F2]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNewAddressForm ? 'Hide Form' : 'Add Address'}</span>
                </button>
              </div>

              {savedAddresses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                        selectedAddressId === addr.id
                          ? 'border-[#C85A17] bg-[#FAF7F2]'
                          : 'border-[#E6DDD0] bg-white hover:border-[#C85A17]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-[#5B1818]">
                        <span>{addr.label}</span>
                        <span className="font-mono-num">{addr.pincode}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#231715]">{addr.fullName}</p>
                      <p className="text-xs text-[#6E5A4F] line-clamp-2">{addr.line1}</p>
                      <p className="text-xs text-[#6E5A4F]">
                        {addr.city} · {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {showNewAddressForm && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-3"
                >
                  <h3 className="text-xs font-semibold text-[#231715]">
                    Save New Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Recipient Full Name"
                      className="px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-Digit Mobile Number"
                      className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="House / Flat No., Street, Landmark"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City & State"
                      className="px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-Digit Pincode"
                      className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                    />
                    <input
                      type="text"
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      placeholder="Label (Home / Temple)"
                      className="px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#5B1818] text-white text-xs font-semibold hover:bg-[#7A2020]"
                  >
                    Save & Select Address
                  </button>
                </form>
              )}
            </div>

            {/* Step 2: Payment Method & Explicit Verification */}
            <form
              onSubmit={handleCompleteOrder}
              className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-6"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-[#231715]">
                  {language === 'hi' ? '2. भुगतान माध्यम चुनें' : '2. Select Payment Method'}
                </h2>
                <p className="text-xs text-[#6E5A4F]">
                  Transparent payment processing — orders record exact verification status
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#C85A17] bg-[#FAF7F2]'
                      : 'border-[#E6DDD0] bg-white hover:border-[#C85A17]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Truck className="w-4 h-4 text-[#C85A17]" />
                    <span className="text-[11px] font-medium text-[#1F6E43]">No Extra Fee</span>
                  </div>
                  <p className="text-xs font-semibold text-[#231715]">Cash on Delivery</p>
                  <p className="text-[11px] text-[#6E5A4F]">Pay Cash or UPI at Doorstep</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-[#C85A17] bg-[#FAF7F2]'
                      : 'border-[#E6DDD0] bg-white hover:border-[#C85A17]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Smartphone className="w-4 h-4 text-[#C85A17]" />
                    <span className="text-[11px] font-medium text-[#6E5A4F]">BHIM / GPay</span>
                  </div>
                  <p className="text-xs font-semibold text-[#231715]">UPI Transfer</p>
                  <p className="text-[11px] text-[#6E5A4F]">VPA + UTR Verification</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-[#C85A17] bg-[#FAF7F2]'
                      : 'border-[#E6DDD0] bg-white hover:border-[#C85A17]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <CreditCard className="w-4 h-4 text-[#C85A17]" />
                    <span className="text-[11px] font-medium text-[#6E5A4F]">RuPay / Visa</span>
                  </div>
                  <p className="text-xs font-semibold text-[#231715]">Debit / Credit Card</p>
                  <p className="text-[11px] text-[#6E5A4F]">Explicit Card Auth</p>
                </button>
              </div>

              {/* Payment Method Details Panel */}
              {paymentMethod === 'COD' && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#231715]">
                    <span>Cash on Delivery (COD) Terms</span>
                    <span className="font-mono-num text-sm text-[#5B1818]">
                      Payable at Delivery: ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A493E]">
                    Free delivery threshold met on orders above ₹499. You can pay in cash or scan the courier’s UPI QR code upon receiving your sanctified package.
                  </p>
                </div>
              )}

              {paymentMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white border border-[#DED4C6] flex items-center justify-center shrink-0">
                      <QrCode className="w-7 h-7 text-[#5B1818]" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[#231715]">
                        Merchant VPA: <span className="font-mono-num">bhaktibazaar.braj@sbi</span>
                      </p>
                      <p className="text-[#6E5A4F]">
                        Enter your payer UPI ID and 12-digit UTR reference so our accounts desk can verify the transfer (status will show &ldquo;Awaiting Verification&rdquo; until reconciled).
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      placeholder="Your UPI ID (e.g., devotee@okicici)"
                      className="px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                    />
                    <input
                      type="text"
                      value={upiUtr}
                      onChange={(e) => setUpiUtr(e.target.value)}
                      placeholder="12-Digit UPI UTR Reference No."
                      className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on Card"
                      className="px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                    />
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number (16 digits)"
                      className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                    />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVV"
                      className="px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-xs text-[#4A3B32] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardConsent}
                      onChange={(e) => setCardConsent(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      I authorize sandbox card verification for ₹{grandTotal.toLocaleString('en-IN')} (recorded as Sandbox Authorization pending gateway capture).
                    </span>
                  </label>
                </div>
              )}

              {paymentError && (
                <div className="p-3 rounded-lg bg-[#FEF3F2] border border-[#FECDCA] text-xs text-[#B42318]">
                  {paymentError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#5B1818] hover:bg-[#7A2020] text-[#FAF7F2] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                <span>
                  {paymentMethod === 'COD'
                    ? `Place Cash on Delivery Order · ₹${grandTotal.toLocaleString('en-IN')}`
                    : paymentMethod === 'UPI'
                    ? `Submit Order with UPI UTR Verification · ₹${grandTotal.toLocaleString('en-IN')}`
                    : `Authorize & Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
                </span>
              </button>
            </form>
          </div>

          {/* Right 5 Columns: Order Summary & Coupon Application */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#EFE7DA] pb-4">
                <h3 className="font-display text-xl font-bold text-[#231715]">
                  {language === 'hi' ? 'आपकी पूजा टोकरी (Order Summary)' : 'Sacred Basket Summary'}
                </h3>
                <span className="text-xs text-[#6E5A4F] tabular-nums">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <p className="text-sm text-[#6E5A4F]">Your sacred basket is currently empty.</p>
                  <button
                    type="button"
                    onClick={onBackToStore}
                    className="px-4 py-2 rounded-lg bg-[#5B1818] text-white text-xs font-semibold"
                  >
                    Explore Devotional Catalog
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#EFE7DA] max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-start gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#F3ECE1] border border-[#E6DDD0] shrink-0">
                        <SacredImage src={item.image} alt={item.nameEn} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#231715] truncate">
                          {language === 'hi' ? item.nameHi : item.nameEn}
                        </p>
                        <p className="text-[11px] text-[#6E5A4F]">
                          {item.size} · {item.variation}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => onUpdateCartQty(idx, -1)}
                            className="w-6 h-6 rounded border border-[#DED4C6] text-xs flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-mono-num text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateCartQty(idx, 1)}
                            className="w-6 h-6 rounded border border-[#DED4C6] text-xs flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveCartItem(idx)}
                            className="ml-2 text-[#B42318] hover:opacity-80"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="font-mono-num text-xs font-semibold text-[#231715]">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Box */}
              <div className="pt-4 border-t border-[#EFE7DA] space-y-2">
                <label className="block text-xs font-semibold text-[#231715]">
                  Apply Festival Coupon (Try <span className="font-mono-num text-[#9A3412]">RADHE10</span> or{' '}
                  <span className="font-mono-num text-[#9A3412]">BHAKTI15</span>)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 text-xs font-mono-num uppercase bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-lg bg-[#EFE7DA] hover:bg-[#E4D7C5] text-xs font-semibold text-[#5B1818]"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-xs text-[#9A3412] flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{couponMessage}</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#EFE7DA] space-y-2 text-xs">
                <div className="flex justify-between text-[#6E5A4F]">
                  <span>Subtotal</span>
                  <span className="font-mono-num">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#1F6E43] font-medium">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono-num">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E5A4F]">
                  <span>Sanctified Packaging & Shipping</span>
                  <span className="font-mono-num">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#EFE7DA] flex justify-between text-base font-bold text-[#231715]">
                  <span>Total Payable</span>
                  <span className="font-mono-num">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Order Tracking & Order History View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 4 Columns: Order History List + Search */}
          <div className="lg:col-span-4 bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#231715]">
              {language === 'hi' ? 'आपके ऑर्डर (Order History)' : 'Your Sacred Orders'}
            </h2>
            <input
              type="text"
              value={searchOrderQuery}
              onChange={(e) => setSearchOrderQuery(e.target.value)}
              placeholder="Search by Order ID (e.g., BB-ORD-9042)"
              className="w-full px-3 py-2 text-xs font-mono-num bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
            />
            <div className="space-y-2.5">
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  type="button"
                  onClick={() => {
                    setSelectedOrderId(ord.id);
                    setSearchOrderQuery('');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1 ${
                    trackedOrder?.id === ord.id
                      ? 'border-[#C85A17] bg-[#FAF7F2]'
                      : 'border-[#E6DDD0] bg-white hover:border-[#C85A17]/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono-num font-bold text-[#5B1818]">{ord.id}</span>
                    <span className="font-mono-num font-semibold text-[#231715]">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-[#6E5A4F]">
                    {ord.createdAt} · {ord.items.length} items
                  </p>
                  <p className="text-xs font-medium text-[#1F6E43]">{ord.orderStatus}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right 8 Columns: Active Order Live Tracking & Receipt */}
          <div className="lg:col-span-8">
            {trackedOrder ? (
              <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#EFE7DA]">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A4F]">
                      <span className="font-mono-num font-semibold text-[#5B1818]">
                        Order {trackedOrder.id}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">Placed on {trackedOrder.createdAt}</span>
                      {trackedOrder.courierPartner && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{trackedOrder.courierPartner}</span>
                        </>
                      )}
                      {trackedOrder.awbNumber && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-[#231715]">
                            AWB: {trackedOrder.awbNumber}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="font-display text-2xl font-bold text-[#231715]">
                      {trackedOrder.orderStatus} — Estimated Arrival: {trackedOrder.estimatedDelivery}
                    </h2>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-[#231715]">
                      Payment: {trackedOrder.paymentMethod}
                    </p>
                    <p className="text-[#9A3412]">{trackedOrder.paymentStatus}</p>
                  </div>
                </div>

                {/* Overall Shipment Progress Bar + Vertical Timeline Progress Bar with Dates */}
                {(() => {
                  const totalSteps = trackedOrder.trackingSteps.length;
                  const completedCount = trackedOrder.trackingSteps.filter(
                    (s) => s.completed
                  ).length;
                  const progressPercent =
                    totalSteps > 1
                      ? Math.min(
                          100,
                          Math.round(((completedCount - 0.5) / (totalSteps - 1)) * 100)
                        )
                      : 100;
                  const verticalBarPercent =
                    totalSteps > 1
                      ? Math.min(
                          100,
                          Math.max(
                            0,
                            Math.round(((completedCount - 1) / (totalSteps - 1)) * 100)
                          )
                        )
                      : 100;

                  return (
                    <div className="space-y-6">
                      {/* Top Horizontal Progress Summary */}
                      <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-semibold uppercase tracking-wider text-[#5B1818]">
                            {language === 'hi'
                              ? 'श्री वृंदावन प्रेषण एवं लाइव प्रगति रेखा'
                              : 'Vrindavan Dispatch & Vertical Transit Progress'}
                          </span>
                          <span className="font-mono-num tabular-nums text-[#6E5A4F]">
                            <strong className="text-[#231715]">{completedCount}</strong> of{' '}
                            <strong className="text-[#231715]">{totalSteps}</strong> milestones completed (
                            {Math.max(15, progressPercent)}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#E6DDD0] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#1F6E43] via-[#C85A17] to-[#D97706] transition-all duration-300"
                            style={{ width: `${Math.max(12, progressPercent)}%` }}
                          />
                        </div>
                      </div>

                      {/* Vertical Timeline Progress Bar with Dates */}
                      <div className="relative pl-1 sm:pl-2">
                        {trackedOrder.trackingSteps.map((step, idx) => {
                          const isLast = idx === totalSteps - 1;
                          const nextCompleted =
                            !isLast && trackedOrder.trackingSteps[idx + 1]?.completed;
                          const isCurrent =
                            step.current ||
                            (step.completed &&
                              !trackedOrder.trackingSteps[idx + 1]?.completed);

                          const fallbackParts = step.timestamp.split('·').map((s) => s.trim());
                          const displayDate = step.date || fallbackParts[0] || step.timestamp;
                          const displayTime =
                            step.time ||
                            fallbackParts[1] ||
                            (step.completed ? 'Verified Scan' : 'Scheduled');

                          return (
                            <div
                              key={step.id || idx}
                              className="relative grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 pb-7 last:pb-0"
                            >
                              {/* Left Column: Explicit Date & Time (Tabular Numerals) */}
                              <div className="sm:col-span-3 sm:text-right pr-2 pt-0.5 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2 sm:gap-0.5">
                                <span
                                  className={`font-mono-num tabular-nums text-xs font-semibold ${
                                    step.completed ? 'text-[#231715]' : 'text-[#8C7A6B]'
                                  }`}
                                >
                                  {displayDate}
                                </span>
                                <span className="font-mono-num tabular-nums text-[11px] text-[#6E5A4F]">
                                  {displayTime}
                                </span>
                              </div>

                              {/* Center Column: Vertical Progress Bar Spine + Milestone Node */}
                              <div className="sm:col-span-9 relative pl-9 sm:pl-10">
                                {/* Vertical Connecting Line Segment */}
                                {!isLast && (
                                  <div
                                    className="absolute left-[13px] sm:left-[15px] top-6 bottom-[-28px] w-1 rounded-full bg-[#E6DDD0] overflow-hidden"
                                    aria-hidden="true"
                                  >
                                    <div
                                      className={`w-full transition-all duration-300 ${
                                        nextCompleted
                                          ? 'h-full bg-[#1F6E43]'
                                          : step.completed
                                          ? 'h-1/2 bg-gradient-to-b from-[#1F6E43] to-[#C85A17]'
                                          : 'h-0'
                                      }`}
                                    />
                                  </div>
                                )}

                                {/* Circular Milestone Node */}
                                <div
                                  className={`absolute left-0 sm:left-0.5 top-0.5 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                    isCurrent
                                      ? 'bg-[#C85A17] text-white ring-4 ring-[#C85A17]/20 shadow-xs'
                                      : step.completed
                                      ? 'bg-[#1F6E43] text-white'
                                      : 'bg-[#FAF7F2] border-2 border-[#D5C7B4] text-[#8C7A6B]'
                                  }`}
                                >
                                  {step.completed ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Clock className="w-3.5 h-3.5" />
                                  )}
                                </div>

                                {/* Right Event Details Card */}
                                <div
                                  className={`p-4 rounded-xl border transition-colors space-y-1.5 ${
                                    isCurrent
                                      ? 'bg-[#FAF7F2] border-[#C85A17]'
                                      : step.completed
                                      ? 'bg-[#FFFDF9] border-[#E6DDD0]'
                                      : 'bg-[#FAF7F2]/60 border-[#EFE7DA]'
                                  }`}
                                >
                                  {/* Unboxed Stage & Hub Metadata Line */}
                                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E5A4F]">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span
                                        className={`font-semibold uppercase tracking-wider ${
                                          isCurrent
                                            ? 'text-[#C85A17]'
                                            : step.completed
                                            ? 'text-[#1F6E43]'
                                            : 'text-[#8C7A6B]'
                                        }`}
                                      >
                                        {step.stage ||
                                          (step.completed ? 'Completed Milestone' : 'Upcoming Stage')}
                                      </span>
                                      {step.hubCode && (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span className="font-mono-num text-[#5B1818]">
                                            Hub: {step.hubCode}
                                          </span>
                                        </>
                                      )}
                                      {isCurrent && (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span className="font-semibold text-[#C85A17]">
                                            {language === 'hi' ? 'वर्तमान स्थिति' : 'Current Active Stage'}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <span className="font-mono-num tabular-nums text-[#6E5A4F] sm:hidden">
                                      {displayDate} · {displayTime}
                                    </span>
                                  </div>

                                  {/* Event Title */}
                                  <p
                                    className={`text-xs sm:text-sm font-semibold ${
                                      step.completed ? 'text-[#231715]' : 'text-[#6E5A4F]'
                                    }`}
                                  >
                                    {language === 'hi' && step.titleHi
                                      ? step.titleHi
                                      : step.title}
                                  </p>

                                  {/* Detailed Event Description */}
                                  {(step.description || step.descriptionHi) && (
                                    <p className="text-xs text-[#4A3B32] leading-relaxed">
                                      {language === 'hi' && step.descriptionHi
                                        ? step.descriptionHi
                                        : step.description}
                                    </p>
                                  )}

                                  {/* Facility Location */}
                                  <p className="text-xs text-[#6E5A4F] flex items-center gap-1 pt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#C85A17] shrink-0" />
                                    <span>{step.location}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <span className="sr-only">
                          Vertical progress spine {verticalBarPercent}% complete
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Ordered Items & Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#EFE7DA]">
                  <div className="space-y-2 text-xs">
                    <h4 className="font-semibold text-[#231715] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C85A17]" />
                      <span>Delivery Destination</span>
                    </h4>
                    <p className="font-medium text-[#231715]">{trackedOrder.customerName}</p>
                    <p className="text-[#6E5A4F]">{trackedOrder.shippingAddress}</p>
                    <p className="text-[#6E5A4F]">
                      {trackedOrder.city} — <span className="font-mono-num">{trackedOrder.pincode}</span>
                    </p>
                    <p className="text-[#6E5A4F]">Phone: {trackedOrder.customerPhone}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <h4 className="font-semibold text-[#231715] flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#C85A17]" />
                      <span>Items in Shipment ({trackedOrder.items.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {trackedOrder.items.map((it, i) => (
                        <div key={i} className="flex justify-between gap-2 text-[#4A3B32]">
                          <span className="truncate">
                            {it.quantity}x {language === 'hi' ? it.nameHi : it.nameEn}
                          </span>
                          <span className="font-mono-num font-semibold shrink-0">
                            ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl text-center text-sm text-[#6E5A4F]">
                No orders found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
