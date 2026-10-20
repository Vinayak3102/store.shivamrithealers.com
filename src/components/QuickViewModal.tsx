import React from 'react';
import { X, Heart, Star, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import type { ProductItem } from '../data/storeProducts';

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem, qty: number) => void;
  onBuyNow: (product: ProductItem, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [qty, setQty] = React.useState(1);
  const [selectedImg, setSelectedImg] = React.useState(0);

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : [product.image];
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl text-slate-900 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white hover:text-slate-950 transition"
        >
          <X className="size-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Product Image Gallery */}
          <div className="bg-[#f9f8f5] p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-square w-full max-w-[340px] overflow-hidden rounded-lg bg-white shadow-inner flex items-center justify-center">
              <img
                src={images[selectedImg] || product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-all duration-300"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#e07038] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`size-14 rounded-md overflow-hidden border-2 transition ${
                      selectedImg === idx ? 'border-[#18283e] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4af37]">
                  {product.sign} • {product.signHi}
                </span>
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`grid size-8 place-items-center rounded-full border transition ${
                    isWishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <Heart className={`size-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
                </button>
              </div>

              <h2 id="quick-view-title" className="font-serif text-2xl font-semibold text-[#18283e] mt-1">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-serif text-3xl font-bold text-[#18283e]">₹{product.price.toLocaleString('en-IN')}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock & Consecrated
                </span>
              </div>

              <p className="text-xs leading-relaxed text-slate-600 mt-4">
                {product.description}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block text-slate-400 font-medium">Stone Type:</span>
                  <span className="font-semibold text-slate-800">{product.stoneType}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium">Bead Size:</span>
                  <span className="font-semibold text-slate-800">{product.size}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button
                    disabled={qty <= 1}
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="size-9 grid place-items-center text-slate-700 hover:bg-slate-100 rounded-l-lg disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="size-9 grid place-items-center text-slate-700 hover:bg-slate-100 rounded-r-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product, qty);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#18283e] hover:bg-[#121e30] text-white py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition shadow"
                >
                  <ShoppingBag className="size-4" />
                  Add to Cart
                </button>
              </div>

              <button
                onClick={() => {
                  onBuyNow(product, qty);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#e07038] hover:bg-[#c95e28] text-white py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition shadow"
              >
                <Zap className="size-4" />
                Buy Now (Instant Checkout)
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-600" /> 100% Authentic Crystal
                </span>
                <span>•</span>
                <span>Vedic Energy Attuned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
