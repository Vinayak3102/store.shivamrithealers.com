import React, { useState } from 'react';
import { X, Star, ShieldCheck, Sparkles, Plus, Minus, ShoppingBag, Zap, Heart, MessageSquare } from 'lucide-react';
import type { Product } from '../data/products';
import type { Currency } from '../utils/storeLogic';
import { ProductVisual } from './ProductVisual';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  currency: Currency;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  currency,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ritual' | 'benefits' | 'lineage'>('ritual');

  if (!isOpen || !product) return null;

  const displayPrice = currency === 'USD'
    ? `$${Math.round(product.priceInr * 0.0122)}`
    : `₹${product.priceInr.toLocaleString('en-IN')}`;

  const originalPrice = currency === 'USD'
    ? `$${Math.round(product.originalPriceInr * 0.0122)}`
    : `₹${product.originalPriceInr.toLocaleString('en-IN')}`;

  const savingsInr = product.originalPriceInr - product.priceInr;
  const savingsPercent = Math.round((savingsInr / product.originalPriceInr) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Header Close Bar */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            aria-label="Close product view"
            className="p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Scroll Area */}
        <div className="overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Visual Showcase */}
            <div className="space-y-4">
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm flex items-center justify-center relative">
                <ProductVisual visualType={product.visualType} imageUrl={product.imageUrl} alt={product.name} />
                <span className="absolute top-3 left-3 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-stone-900 text-white rounded-md">
                  {product.tag}
                </span>
              </div>

              {/* Consecration Highlights Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Chakra Affinity</span>
                  <span className="text-stone-800 font-medium">{product.chakraAffinity}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Element</span>
                  <span className="text-stone-800 font-medium">{product.elementAffinity}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="space-y-5">
              {/* Category & Title */}
              <div>
                <div className="text-xs text-amber-900 font-semibold uppercase tracking-wider mb-1">
                  {product.category}
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-stone-900 font-semibold leading-tight">
                  {product.name}
                </h2>

                {/* Rating Bar */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-stone-800 font-mono tabular-nums">{product.rating}</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-500 font-mono tabular-nums">{product.reviewCount} Consecrated Reviews</span>
                </div>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-stone-200">
                <span className="text-3xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                  {displayPrice}
                </span>
                <span className="text-sm line-through text-stone-400 font-mono tabular-nums">
                  {originalPrice}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {savingsPercent}%
                </span>
              </div>

              {/* Short Bio */}
              <p className="text-xs md:text-sm text-stone-700 leading-relaxed">
                {product.longDesc}
              </p>

              {/* Tabs Section */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-2 border-b border-stone-200 text-xs">
                  <button
                    onClick={() => setActiveTab('ritual')}
                    className={`pb-2 font-medium transition-colors border-b-2 -mb-[1px] ${
                      activeTab === 'ritual'
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Ritual Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab('benefits')}
                    className={`pb-2 font-medium transition-colors border-b-2 -mb-[1px] ${
                      activeTab === 'benefits'
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Energetic Benefits
                  </button>
                  <button
                    onClick={() => setActiveTab('lineage')}
                    className={`pb-2 font-medium transition-colors border-b-2 -mb-[1px] ${
                      activeTab === 'lineage'
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sanctification Guarantee
                  </button>
                </div>

                <div className="text-xs text-stone-700 pt-1 min-h-[90px]">
                  {activeTab === 'ritual' && (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {product.ritualInstructions.map((inst, idx) => (
                        <li key={idx} className="leading-relaxed">{inst}</li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'benefits' && (
                    <ul className="space-y-1.5 list-disc list-inside">
                      {product.benefits.map((b, idx) => (
                        <li key={idx} className="leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  )}
                  {activeTab === 'lineage' && (
                    <p className="leading-relaxed bg-amber-50/70 p-3 rounded-lg border border-amber-200/60">
                      <strong>Reiki Grandmaster Attunement:</strong> {product.consecrationNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-semibold text-stone-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      aria-label="Increase quantity"
                      className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Only {product.stockCount} consecrated items available in this lunar cycle
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="py-3 px-4 bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold rounded-xl border border-stone-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Basket
                  </button>

                  <button
                    onClick={() => {
                      onBuyNow(product, quantity);
                      onClose();
                    }}
                    className="py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Zap className="w-4 h-4 text-amber-300" /> Instant Buy
                  </button>
                </div>

                {/* Direct WhatsApp Guidance */}
                <div className="pt-2 text-center">
                  <a
                    href="https://wa.me/919913406880?text=Hello%20ShivAmrit%20Healers,%20I%20have%20a%20question%20about%20your%20consecrated%20healing%20items."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 hover:text-emerald-950 font-medium hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Need personalized guidance? WhatsApp Grandmaster Team (+91 9913406880)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
