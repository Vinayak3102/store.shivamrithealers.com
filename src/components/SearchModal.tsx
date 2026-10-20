import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import type { ProductItem } from '../data/storeProducts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameHi.includes(q) ||
          p.sign.toLowerCase().includes(q) ||
          p.signHi.includes(q) ||
          p.stones.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    : products.slice(0, 8);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
          <Search className="size-5 text-slate-400" />
          <input
            id="search-dialog-title"
            autoFocus
            type="text"
            placeholder="Search by zodiac sign, stone (e.g. Amethyst, Pyrite), or Hindi name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm outline-none text-slate-800 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="size-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            Esc
          </button>
        </div>

        <div className="p-3 bg-slate-50 text-[11px] text-slate-500 flex justify-between">
          <span>{filtered.length} matching pieces in consecrated catalogue</span>
          <span className="text-[#d4af37] font-semibold">ShivAmrit Healers</span>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              No crystal pieces found matching &ldquo;{query}&rdquo;. Try &ldquo;Aries&rdquo;, &ldquo;मेष&rdquo;, or &ldquo;Rose Quartz&rdquo;.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-12 rounded-md object-cover bg-slate-100"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {item.sign} • {item.signHi} · {item.stones.split(',').slice(0, 2).join(',')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#18283e]">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.compareAtPrice && item.compareAtPrice > item.price && (
                    <span className="block text-[10px] text-slate-400 line-through">
                      ₹{item.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
