import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import {
  Language,
  PINCODE_DIRECTORY,
  ProductItem,
  ProductReview,
} from '../data/marketplaceData';
import { SacredImage } from './SacredImage';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: ProductItem;
  allProducts: ProductItem[];
  language: Language;
  isWishlisted: boolean;
  defaultPincode: string;
  onBack: () => void;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, size: string, variation: string, qty: number) => void;
  onBuyNow: (product: ProductItem, size: string, variation: string, qty: number) => void;
  onToggleWishlist: (productId: string) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  language,
  isWishlisted,
  defaultPincode,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onAddReview,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedVariation, setSelectedVariation] = useState<string>(
    product.variations[0] || 'Default'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Delivery Pincode Estimator
  const [pincode, setPincode] = useState(defaultPincode || '281121');
  const [checkedPincode, setCheckedPincode] = useState(defaultPincode || '281121');

  // New Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Keep selected states synced if user selects a related product
  React.useEffect(() => {
    setSelectedImage(product.image);
    setSelectedSize(product.sizes[0] || 'Standard');
    setSelectedVariation(product.variations[0] || 'Default');
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const pinInfo = PINCODE_DIRECTORY[checkedPincode] || {
    city: checkedPincode.length === 6 ? `Pincode ${checkedPincode} Zone` : 'Standard India Zone',
    state: 'India',
    days: product.deliveryDays + 1,
    codAvailable: true,
  };

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + pinInfo.days);
  const formattedEstDate = estimatedDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedVariation, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, {
      author: reviewAuthor.trim(),
      location: reviewLocation.trim() || 'India',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewAuthor('');
    setReviewLocation('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categoryId === product.categoryId || p.tradition === product.tradition)
    )
    .slice(0, 3);

  const galleryImages = Array.from(new Set([product.image, ...product.gallery]));

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6DDD0]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#5B1818] hover:text-[#9A3412] transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस बाज़ार में जाएं' : 'Back to Catalog'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#6E5A4F]">
          <span>{language === 'hi' ? product.categoryNameHi : product.categoryNameEn}</span>
          <span aria-hidden="true">·</span>
          <span>{product.traditionLabel}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">SKU: {product.sku}</span>
        </div>
      </div>

      {/* Main Contiguous Split: Sticky Gallery Left + Sticky Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Sticky High-Resolution Gallery & Authenticity */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F3ECE1] border border-[#E6DDD0]">
            <SacredImage
              src={selectedImage}
              alt={product.nameEn}
              className="w-full h-full object-cover"
            />
            {product.statusTag && (
              <div className="absolute top-4 left-4 bg-[#FFFDF9]/95 px-3 py-1 text-xs font-medium text-[#5B1818] border border-[#E6DDD0]">
                {product.statusTag}
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-24 aspect-[4/3] rounded-lg overflow-hidden border transition-all shrink-0 ${
                    selectedImage === imgUrl
                      ? 'border-[#C85A17] ring-2 ring-[#C85A17]/30'
                      : 'border-[#E6DDD0] opacity-75 hover:opacity-100'
                  }`}
                >
                  <SacredImage src={imgUrl} alt={`${product.nameEn} view ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          {/* Sanctity & Authenticity Provenance Box */}
          <div className="p-5 rounded-xl bg-[#F4EFE6] border border-[#E6DDD0] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#5B1818] font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C85A17]" />
                {language === 'hi'
                  ? 'भक्ति बाज़ार प्रामाणिकता एवं शुद्धता प्रमाण'
                  : 'Bhakti Bazaar Sanctity & Provenance Guarantee'}
              </span>
              <span>{product.origin}</span>
            </div>
            <p className="text-xs text-[#5A493E] leading-relaxed">
              {language === 'hi' ? product.authenticityNoteHi : product.authenticityNoteEn}
            </p>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase & Specification Module */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#6E5A4F]">
              <span className="font-medium text-[#9A3412]">{product.sellerName}</span>
              <span aria-hidden="true">·</span>
              <span>{product.sellerLocation}</span>
              {product.verifiedSeller && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-[#1F6E43] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === 'hi' ? 'सत्यापित विक्रेता' : 'Verified Temple Vendor'}
                  </span>
                </>
              )}
            </div>

            {/* Title & Bilingual Subtitle */}
            <div className="space-y-1.5">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231715] leading-tight">
                {language === 'hi' ? product.nameHi : product.nameEn}
              </h1>
              <p className="text-sm text-[#6E5A4F]">
                {language === 'hi' ? product.nameEn : product.nameHi}
              </p>
            </div>

            {/* Rating & Stock Status Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E5A4F] tabular-nums">
              <span className="inline-flex items-center gap-1 font-semibold text-[#231715]">
                <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
                {product.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {product.reviews.length + product.reviewCount}{' '}
                {language === 'hi' ? 'सत्यापित भक्त समीक्षाएं' : 'Verified Devotee Reviews'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1F6E43] font-medium">
                {product.inStock
                  ? language === 'hi'
                    ? `स्टॉक में उपलब्ध (${product.stockCount} शेष)`
                    : `In Stock (${product.stockCount} units ready for dispatch)`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Pricing Block */}
            <div className="pt-4 pb-4 border-y border-[#EFE7DA] flex flex-wrap items-baseline gap-3">
              <span className="font-mono-num tabular-nums text-3xl font-bold text-[#231715]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="font-mono-num tabular-nums text-base text-[#8C7A6B] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono-num tabular-nums text-sm font-semibold text-[#9A3412]">
                    Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({discountPercent}% OFF)
                  </span>
                </>
              )}
              <span className="w-full text-xs text-[#6E5A4F]">
                {language === 'hi'
                  ? 'सभी कर सहित · ₹499 से अधिक के ऑर्डर पर निःशुल्क ब्रज एक्सप्रेस डिलीवरी'
                  : 'Inclusive of all taxes · Free sanctified delivery on orders above ₹499'}
              </span>
            </div>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-[#231715]">
                  {language === 'hi' ? 'आकार चुनें (Size):' : 'Select Size / Dimension:'}{' '}
                  <span className="font-normal text-[#6E5A4F]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        selectedSize === size
                          ? 'bg-[#5B1818] text-[#FAF7F2] border-[#5B1818]'
                          : 'bg-[#FAF7F2] text-[#231715] border-[#DED4C6] hover:border-[#9A3412]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variation Selector */}
            {product.variations.length > 0 && (
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-[#231715]">
                  {language === 'hi' ? 'प्रकार / विकल्प चुनें:' : 'Select Variation / Craft Style:'}{' '}
                  <span className="font-normal text-[#6E5A4F]">{selectedVariation}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((variation) => (
                    <button
                      key={variation}
                      type="button"
                      onClick={() => setSelectedVariation(variation)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                        selectedVariation === variation
                          ? 'bg-[#C85A17] text-white border-[#C85A17]'
                          : 'bg-[#FAF7F2] text-[#231715] border-[#DED4C6] hover:border-[#C85A17]'
                      }`}
                    >
                      {variation}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper + Primary CTAs */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Stepper */}
                <div className="inline-flex items-center border border-[#DED4C6] rounded-lg bg-[#FAF7F2]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#231715] hover:bg-[#EFE7DA] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono-num tabular-nums text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#231715] hover:bg-[#EFE7DA] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 min-w-[160px] py-3 px-5 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                    addedFeedback
                      ? 'bg-[#1F6E43] text-white'
                      : 'bg-[#5B1818] text-[#FAF7F2] hover:bg-[#7A2020]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === 'hi' ? 'कार्ट में जोड़ा गया' : 'Added to Cart'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {language === 'hi' ? 'कार्ट में डालें' : 'Add to Cart'} · ₹
                        {(product.price * quantity).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className="h-11 px-4 rounded-lg border border-[#DED4C6] bg-[#FAF7F2] hover:bg-[#EFE7DA] inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#5B1818]"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-[#B42318] text-[#B42318]' : 'text-[#5B1818]'
                    }`}
                  />
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={() => onBuyNow(product, selectedSize, selectedVariation, quantity)}
                className="w-full py-3 px-5 rounded-lg bg-[#C85A17] hover:bg-[#B04B0E] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>
                  {language === 'hi'
                    ? 'अभी खरीदें (त्वरित सुरक्षित चेकआउट)'
                    : 'Buy Now — Proceed to Direct Checkout'}
                </span>
              </button>
            </div>

            {/* Delivery Estimate & Pincode Checker */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#231715]">
                  <MapPin className="w-4 h-4 text-[#C85A17]" />
                  <span>
                    {language === 'hi'
                      ? 'डिलीवरी अनुमान जांचें (पिनकोड):'
                      : 'Check Delivery Estimate by Pincode:'}
                  </span>
                </div>
                <span className="text-xs text-[#6E5A4F]">{pinInfo.city}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-2 text-xs font-mono-num bg-white border border-[#DED4C6] rounded-lg focus:outline-none focus:border-[#C85A17]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (pincode.length === 6) setCheckedPincode(pincode);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#5B1818] bg-[#EFE7DA] hover:bg-[#E4D7C5] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  {language === 'hi' ? 'जांचें' : 'Check'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A3B32] pt-1">
                <Truck className="w-4 h-4 text-[#1F6E43]" />
                <span>
                  {language === 'hi' ? 'अनुमानित आगमन:' : 'Estimated Delivery by'}{' '}
                  <strong className="text-[#231715]">{formattedEstDate}</strong> ({pinInfo.days} days from{' '}
                  {product.origin.split(',')[0]})
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#1F6E43] font-medium">
                  {pinInfo.codAvailable ? 'Cash on Delivery & UPI Available' : 'Prepaid Only'}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Description & Material Specifications */}
          <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#231715]">
                {language === 'hi' ? 'उत्पाद विवरण एवं महत्व' : 'Sacred Craftsmanship & Description'}
              </h2>
              <p className="text-sm text-[#4A3B32] leading-relaxed">
                {language === 'hi' ? product.descriptionHi : product.descriptionEn}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#EFE7DA]">
              <h3 className="text-sm font-semibold text-[#231715]">
                {language === 'hi'
                  ? 'सामग्री एवं तकनीकी विनिर्देश'
                  : 'Material & Authenticity Specifications'}
              </h3>
              <dl className="divide-y divide-[#EFE7DA] text-xs">
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#6E5A4F]">
                    {language === 'hi' ? 'मूल सामग्री' : 'Primary Material'}
                  </dt>
                  <dd className="col-span-2 font-medium text-[#231715]">{product.material}</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-4">
                  <dt className="text-[#6E5A4F]">
                    {language === 'hi' ? 'उद्गम धाम' : 'Place of Origin'}
                  </dt>
                  <dd className="col-span-2 font-medium text-[#231715]">{product.origin}</dd>
                </div>
                {product.specs.map((spec, i) => (
                  <div key={i} className="py-2.5 grid grid-cols-3 gap-4">
                    <dt className="text-[#6E5A4F]">
                      {language === 'hi' ? spec.labelHi : spec.labelEn}
                    </dt>
                    <dd className="col-span-2 font-medium text-[#231715]">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-[#FFFDF9] border border-[#E6DDD0] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-[#231715]">
                  {language === 'hi' ? 'भक्तों के अनुभव एवं समीक्षाएं' : 'Verified Devotee Reviews'}
                </h2>
                <p className="text-xs text-[#6E5A4F]">
                  {product.rating.toFixed(1)} out of 5 · Based on {product.reviewCount + product.reviews.length} ratings
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm((prev) => !prev)}
                className="px-4 py-2 rounded-lg border border-[#5B1818] text-xs font-semibold text-[#5B1818] hover:bg-[#5B1818] hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {showReviewForm
                  ? language === 'hi'
                    ? 'बंद करें'
                    : 'Cancel'
                  : language === 'hi'
                  ? 'समीक्षा लिखें'
                  : 'Write a Review'}
              </button>
            </div>

            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DDD0] space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="Your Full Name (e.g., Keshav Das)"
                    className="px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                  />
                  <input
                    type="text"
                    value={reviewLocation}
                    onChange={(e) => setReviewLocation(e.target.value)}
                    placeholder="City / Temple Community (e.g., ISKCON Delhi)"
                    className="px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-medium text-[#231715]">Rating:</span>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReviewRating(r)}
                      className={`px-2.5 py-1 rounded border tabular-nums ${
                        reviewRating === r
                          ? 'bg-[#C85A17] text-white border-[#C85A17]'
                          : 'bg-white border-[#DED4C6]'
                      }`}
                    >
                      {r} ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share how this sacred item helped your daily puja or japa..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DED4C6] rounded-lg"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#5B1818] text-white text-xs font-semibold hover:bg-[#7A2020]"
                >
                  Submit Review
                </button>
              </form>
            )}

            <div className="divide-y divide-[#EFE7DA] space-y-4">
              {product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#231715]">{rev.author}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#6E5A4F]">{rev.location}</span>
                        {rev.verifiedPurchase && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#1F6E43] font-medium">Verified Purchase</span>
                          </>
                        )}
                      </div>
                      <span className="text-[#8C7A6B] tabular-nums">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#D97706]">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[#4A3B32] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6E5A4F] py-2">
                  Verified devotee reviews from across India. Be the first to add a detailed note for this batch.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E6DDD0] space-y-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#231715]">
                {language === 'hi'
                  ? 'संबंधित भक्ति सामग्री (Related Sacred Essentials)'
                  : 'Companion Sacred Essentials'}
              </h2>
              <p className="text-xs text-[#6E5A4F]">
                Frequently paired by devotees in the {product.traditionLabel} tradition
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                language={language}
                isWishlisted={false}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
