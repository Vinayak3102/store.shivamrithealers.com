import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Tag } from 'lucide-react';
import type { ProductItem } from '../data/storeProducts';
import { FREE_SHIPPING_LIMIT } from '../data/storeProducts';

export interface CartLineItem {
  product: ProductItem;
  qty: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartLineItem[];
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_LIMIT) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 flex max-w-full pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#18283e] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-[#d4af37]" />
              <h2 className="font-serif text-xl font-medium tracking-wide">
                Your Sacred Cart ({items.reduce((acc, i) => acc + i.qty, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#fbf9f5] px-6 py-3 border-b border-slate-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-slate-600">
                Add <span className="font-bold text-[#18283e]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more for <span className="text-[#e07038] font-bold">Free Consecrated Shipping</span>!
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="size-4" /> You have unlocked FREE Express Shipping!
              </p>
            )}
            <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#e07038] transition-all duration-500 rounded-full"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
                <div className="grid size-16 place-items-center rounded-full bg-slate-100 mb-3">
                  <ShoppingBag className="size-8 text-slate-400" />
                </div>
                <h3 className="font-serif text-lg text-slate-700">Your basket is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Discover consecrated zodiac crystal bracelets and healing gemstone jewelry to awaken your balance.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-[#18283e] text-white px-6 py-2 rounded-lg text-xs font-semibold hover:bg-[#121e30] transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition shadow-sm"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-20 rounded-md object-cover bg-slate-50 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-semibold text-[#18283e] truncate">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="text-slate-400 hover:text-red-500 p-1 transition"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {product.sign} • {product.signHi}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="size-7 grid place-items-center text-slate-600 hover:bg-slate-50"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold">{qty}</span>
                        <button
                          onClick={() => onUpdateQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="size-7 grid place-items-center text-slate-600 hover:bg-slate-50"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#18283e]">
                        ₹{(product.price * qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 p-6 bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold">
                    {subtotal >= FREE_SHIPPING_LIMIT ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      '₹99'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#18283e] pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span>
                    ₹{(subtotal + (subtotal >= FREE_SHIPPING_LIMIT ? 0 : 99)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-amber-50/80 p-2.5 rounded-md border border-amber-200/60">
                <Tag className="size-3.5 text-[#d4af37]" />
                <span>Coupon code <strong>SHIVAMRIT10</strong> available at checkout (10% OFF)!</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#18283e] hover:bg-[#121e30] text-white py-3 px-4 rounded-lg text-sm font-semibold tracking-wide transition shadow-md"
              >
                Proceed to Checkout
                <ArrowRight className="size-4 text-[#d4af37]" />
              </button>

              <p className="text-[10.5px] text-center text-slate-400">
                Taxes included. Authentic certificates & energization card in every parcel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
