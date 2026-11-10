import React, { useState } from 'react';
import {
  CheckCircle2,
  Heart,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import {
  Language,
  OrderItemRecord,
  ProductItem,
} from '../data/marketplaceData';
import { SacredImage } from './SacredImage';

export interface UserSession {
  name: string;
  email: string;
  phone: string;
  traditionPreference: string;
  provider: 'email' | 'google';
}

interface MarketplaceDrawersProps {
  language: Language;
  activeDrawer: 'none' | 'cart' | 'wishlist' | 'auth' | 'support';
  onClose: () => void;
  cartItems: OrderItemRecord[];
  wishlistIds: string[];
  allProducts: ProductItem[];
  user: UserSession | null;
  onLoginUser: (user: UserSession) => void;
  onLogoutUser: () => void;
  onUpdateCartQty: (index: number, delta: number) => void;
  onRemoveCartItem: (index: number) => void;
  onProceedToCheckout: () => void;
  onMoveWishlistToCart: (product: ProductItem) => void;
  onRemoveWishlist: (productId: string) => void;
}

export const MarketplaceDrawers: React.FC<MarketplaceDrawersProps> = ({
  language,
  activeDrawer,
  onClose,
  cartItems,
  wishlistIds,
  allProducts,
  user,
  onLoginUser,
  onLogoutUser,
  onUpdateCartQty,
  onRemoveCartItem,
  onProceedToCheckout,
  onMoveWishlistToCart,
  onRemoveWishlist,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [traditionInput, setTraditionInput] = useState('Radha Krishna & Braj');

  const [supportName, setSupportName] = useState(user?.name || '');
  const [supportOrder, setSupportOrder] = useState('BB-ORD-9042');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  if (activeDrawer === 'none') return null;

  const subtotal = cartItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginUser({
      name:
        authMode === 'register' && nameInput.trim()
          ? nameInput.trim()
          : emailInput.split('@')[0] || 'Bhakta Devotee',
      email: emailInput.trim() || 'devotee@bhaktibazaar.in',
      phone: phoneInput.trim() || '+91 98112 34560',
      traditionPreference: traditionInput,
      provider: 'email',
    });
    onClose();
  };

  const handleGoogleSignIn = () => {
    onLoginUser({
      name: 'Yashraj Bhakta',
      email: 'syashraj903@gmail.com',
      phone: '+91 98112 34560',
      traditionPreference: 'Radha Krishna & ISKCON Vaishnav',
      provider: 'google',
    });
    onClose();
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setSupportMessage('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl border-l border-[#E6DDD0] flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#EFE7DA] flex items-center justify-between sticky top-0 bg-[#FFFDF9] z-10">
          <div className="flex items-center gap-2">
            {activeDrawer === 'cart' && <ShoppingBag className="w-5 h-5 text-[#5B1818]" />}
            {activeDrawer === 'wishlist' && <Heart className="w-5 h-5 text-[#B42318]" />}
            {activeDrawer === 'auth' && <User className="w-5 h-5 text-[#5B1818]" />}
            {activeDrawer === 'support' && <MessageCircle className="w-5 h-5 text-[#1F6E43]" />}
            <h2 className="font-display text-xl font-bold text-[#231715]">
              {activeDrawer === 'cart' &&
                (language === 'hi' ? 'आपकी पूजा टोकरी (Shopping Cart)' : 'Your Sacred Basket')}
              {activeDrawer === 'wishlist' &&
                (language === 'hi' ? 'पसंदीदा सूची (Wishlist)' : 'Saved Sacred Wishlist')}
              {activeDrawer === 'auth' &&
                (language === 'hi' ? 'भक्त खाता (Devotee Account)' : 'Devotee Account & Login')}
              {activeDrawer === 'support' &&
                (language === 'hi' ? 'भक्त सहायता केंद्र (24x7 Seva Desk)' : 'Customer & WhatsApp Support')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#DED4C6] flex items-center justify-center text-[#5A493E] hover:bg-[#FAF7F2]"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 flex-1 space-y-5">
          {/* 1. CART DRAWER */}
          {activeDrawer === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-[#C85A17]/50 mx-auto" />
                  <p className="text-sm font-medium text-[#231715]">
                    {language === 'hi' ? 'आपकी पूजा टोकरी खाली है' : 'Your Sacred Basket is Empty'}
                  </p>
                  <p className="text-xs text-[#6E5A4F]">
                    Explore original Vrindavan Tulsi malas, Ashtadhatu idols, and puja samagri.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] text-xs text-[#4A3B32]">
                    {subtotal >= 499 ? (
                      <span className="text-[#1F6E43] font-medium">
                        ✓ Your order qualifies for FREE Sanctified Braj Express Delivery!
                      </span>
                    ) : (
                      <span>
                        Add ₹{(499 - subtotal).toLocaleString('en-IN')} more for FREE Delivery.
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-[#EFE7DA]">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="py-3.5 flex items-start gap-3">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#F3ECE1] border border-[#E6DDD0] shrink-0">
                          <SacredImage src={item.image} alt={item.nameEn} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#231715] line-clamp-1">
                            {language === 'hi' ? item.nameHi : item.nameEn}
                          </p>
                          <p className="text-[11px] text-[#6E5A4F]">
                            {item.size} · {item.variation}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => onUpdateCartQty(idx, -1)}
                              className="w-6 h-6 rounded border border-[#DED4C6] text-xs flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-mono-num text-xs font-semibold">
                              {item.quantity}
                            </span>
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
                              className="ml-2 text-[#B42318]"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <span className="font-mono-num text-xs font-bold text-[#231715]">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 2. WISHLIST DRAWER */}
          {activeDrawer === 'wishlist' && (
            <>
              {wishlistedProducts.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <Heart className="w-10 h-10 text-[#C85A17]/50 mx-auto" />
                  <p className="text-sm font-medium text-[#231715]">No Saved Items Yet</p>
                  <p className="text-xs text-[#6E5A4F]">
                    Click the heart icon on any product to save it for festival shopping.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#EFE7DA]">
                  {wishlistedProducts.map((prod) => (
                    <div key={prod.id} className="py-3.5 flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#F3ECE1] border border-[#E6DDD0] shrink-0">
                        <SacredImage src={prod.image} alt={prod.nameEn} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#231715] truncate">
                          {language === 'hi' ? prod.nameHi : prod.nameEn}
                        </p>
                        <p className="font-mono-num text-xs font-bold text-[#5B1818]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onMoveWishlistToCart(prod)}
                          className="px-3 py-1.5 rounded-lg bg-[#5B1818] text-white text-xs font-semibold"
                        >
                          Add to Cart
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveWishlist(prod.id)}
                          className="p-1.5 text-[#B42318]"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 3. AUTH & GOOGLE LOGIN DRAWER */}
          {activeDrawer === 'auth' && (
            <div className="space-y-5">
              {user ? (
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#5B1818] text-[#FAF7F2] flex items-center justify-center font-display text-xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#231715]">{user.name}</p>
                      <p className="text-xs text-[#6E5A4F]">{user.email}</p>
                      <p className="text-[11px] text-[#9A3412] font-medium">
                        Tradition: {user.traditionPreference}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onLogoutUser}
                    className="w-full py-2.5 rounded-lg border border-[#DED4C6] bg-white text-xs font-semibold text-[#B42318] hover:bg-[#FEF3F2]"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  {/* Google Sign-In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 px-4 rounded-xl border border-[#DED4C6] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#231715] flex items-center justify-center gap-2.5 shadow-2xs transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"
                      />
                    </svg>
                    <span>Continue with Google Account</span>
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[#EFE7DA]" />
                    <span className="shrink mx-3 text-[11px] text-[#8C7A6B]">
                      OR CONTINUE WITH EMAIL / MOBILE
                    </span>
                    <div className="flex-grow border-t border-[#EFE7DA]" />
                  </div>

                  {/* Mode Toggle */}
                  <div className="flex p-1 bg-[#EFE7DA] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${
                        authMode === 'login' ? 'bg-white text-[#231715]' : 'text-[#6E5A4F]'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${
                        authMode === 'register' ? 'bg-white text-[#231715]' : 'text-[#6E5A4F]'
                      }`}
                    >
                      Create Devotee Account
                    </button>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                    {authMode === 'register' && (
                      <input
                        type="text"
                        required
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        placeholder="Full Name (e.g., Radhika Sharma)"
                        className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                      />
                    )}
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Email Address"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                    />
                    {authMode === 'register' && (
                      <>
                        <input
                          type="text"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="Mobile Number (for WhatsApp Order Updates)"
                          className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                        />
                        <select
                          value={traditionInput}
                          onChange={(e) => setTraditionInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                        >
                          <option value="Radha Krishna & Braj">Radha Krishna & Braj</option>
                          <option value="ISKCON & Vaishnav">ISKCON & Vaishnav</option>
                          <option value="Lord Shiva (Shaiva)">Lord Shiva (Shaiva)</option>
                          <option value="Lord Rama & Hanuman">Lord Rama & Hanuman</option>
                          <option value="Mata Rani (Shakti)">Mata Rani (Shakti)</option>
                        </select>
                      </>
                    )}
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Password"
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#5B1818] hover:bg-[#7A2020] text-white font-semibold"
                    >
                      {authMode === 'login' ? 'Sign In to Bhakti Bazaar' : 'Complete Registration'}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* 4. CUSTOMER & WHATSAPP SUPPORT DRAWER */}
          {activeDrawer === 'support' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#ABEFC6] space-y-2">
                <div className="flex items-center justify-between font-semibold text-[#1F6E43]">
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Braj Seva Desk
                  </span>
                  <span>8:00 AM – 10:00 PM IST</span>
                </div>
                <p className="text-[#231715]">
                  Need live photos of a Brass Laddu Gopal idol before dispatch or custom poshak measurements? Connect directly with our Vrindavan team on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919811234560?text=Radhe%20Radhe!%20I%20need%20assistance%20with%20my%20Bhakti%20Bazaar%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-2.5 px-4 rounded-lg bg-[#1F6E43] text-white font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 98112 34560)</span>
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-1.5">
                <p className="font-semibold text-[#231715] flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#C85A17]" />
                  <span>Toll-Free Devotee Helpline: 1800-108-1008</span>
                </p>
                <p className="text-[#6E5A4F]">
                  Dispatch Center: Raman Reti Marg, Near Loi Bazaar, Sri Vrindavan Dham — 281121
                </p>
              </div>

              <form onSubmit={handleSupportSubmit} className="space-y-3">
                <h3 className="font-semibold text-[#231715]">Submit a Support Ticket</h3>
                {supportSubmitted && (
                  <div className="p-3 rounded-lg bg-[#ECFDF3] text-[#1F6E43] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ticket #BB-SUP-409 logged! Our Vrindavan desk will reply within 2 hours.</span>
                  </div>
                )}
                <input
                  type="text"
                  required
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
                <input
                  type="text"
                  value={supportOrder}
                  onChange={(e) => setSupportOrder(e.target.value)}
                  placeholder="Order ID (Optional)"
                  className="w-full px-3 py-2 font-mono-num bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
                <textarea
                  rows={3}
                  required
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="How can we assist you with your devotional order?"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DED4C6] rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#5B1818] text-white font-semibold"
                >
                  Send Message to Seva Desk
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Cart Footer CTA */}
        {activeDrawer === 'cart' && cartItems.length > 0 && (
          <div className="p-5 border-t border-[#EFE7DA] bg-[#FFFDF9] space-y-3 sticky bottom-0">
            <div className="flex items-center justify-between text-sm font-bold text-[#231715]">
              <span>Subtotal</span>
              <span className="font-mono-num">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-5 rounded-xl bg-[#5B1818] hover:bg-[#7A2020] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              <span>
                {language === 'hi'
                  ? 'सुरक्षित चेकआउट पर जाएं (Proceed to Checkout)'
                  : 'Proceed to Secure Checkout'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
