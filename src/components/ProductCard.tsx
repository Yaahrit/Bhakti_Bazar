import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Check, ShieldCheck } from 'lucide-react';
import { ProductItem, Language } from '../data/marketplaceData';
import { SacredImage } from './SacredImage';

interface ProductCardProps {
  product: ProductItem;
  language: Language;
  isWishlisted: boolean;
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, size: string, variation: string, qty: number) => void;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  isWishlisted,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(
      product,
      product.sizes[0] || 'Standard',
      product.variations[0] || 'Default',
      1
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col bg-[#FFFDF9] border border-[#E6DDD0] rounded-xl overflow-hidden cursor-pointer transition-transform duration-150 hover:-translate-y-0.5"
    >
      {/* Image Container: 4:3 Uniform Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full bg-[#F3ECE1] overflow-hidden">
        <SacredImage
          src={product.image}
          alt={language === 'hi' ? product.nameHi : product.nameEn}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          fallbackLabel={language === 'hi' ? product.nameHi : product.nameEn}
        />

        {/* Maximum 1 subtle text tag */}
        {product.statusTag && (
          <div className="absolute top-3 left-3 bg-[#FFFDF9]/95 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#5B1818] border border-[#E6DDD0]">
            {product.statusTag}
          </div>
        )}

        {/* Wishlist Affordance */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-[#FFFDF9]/90 backdrop-blur-xs border border-[#E6DDD0] flex items-center justify-center text-[#5B1818] hover:bg-[#FFFDF9] transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#B42318] text-[#B42318]' : 'text-[#5B1818]'
            }`}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div className="space-y-1.5">
          {/* Zero-Pill Unboxed Metadata with · separators */}
          <div className="flex items-center gap-1.5 text-xs text-[#6E5A4F] truncate">
            <span className="truncate">
              {language === 'hi' ? product.categoryNameHi : product.categoryNameEn}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.sellerLocation}</span>
            {product.verifiedSeller && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 text-[#7A4B16] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C85A17]" />
                  <span>{language === 'hi' ? 'प्रमाणित' : 'Verified'}</span>
                </span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-[16px] font-semibold leading-snug text-[#231715] line-clamp-2 group-hover:text-[#9A3412] transition-colors">
            {language === 'hi' ? product.nameHi : product.nameEn}
          </h3>

          {/* Quiet Subtitle / Material */}
          <p className="text-xs text-[#6E5A4F] line-clamp-1">
            {language === 'hi' ? product.authenticityNoteHi : product.authenticityNoteEn}
          </p>
        </div>

        {/* Bottom Price + Rating + Quick Add Row */}
        <div className="pt-3 border-t border-[#EFE7DA] flex items-end justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num tabular-nums text-[16px] font-semibold text-[#231715]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-mono-num tabular-nums text-xs text-[#8C7A6B] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="font-mono-num tabular-nums text-xs font-medium text-[#9A3412]">
                  {discountPercent}% off
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-xs text-[#6E5A4F] tabular-nums">
              <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
              <span className="font-medium text-[#231715]">{product.rating.toFixed(1)}</span>
              <span aria-hidden="true">·</span>
              <span>
                {product.reviewCount} {language === 'hi' ? 'समीक्षाएं' : 'reviews'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              justAdded
                ? 'bg-[#1F6E43] text-white'
                : 'bg-[#5B1818] text-[#FAF7F2] hover:bg-[#7A2020]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'जुड़ गया' : 'Added'}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कार्ट में डालें' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
