import React from 'react';
import type { Product } from '../data/products';

interface ProductVisualProps {
  visualType: Product['visualType'];
  imageUrl?: string;
  alt?: string;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  visualType,
  imageUrl,
  alt = '',
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  if (imageUrl && !imageError) {
    return (
      <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none bg-stone-100 ${className}`}>
        <img
          src={imageUrl}
          alt={alt || 'Sacred consecrated item'}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center select-none ${className}`}>
      {visualType === 'pyramid' && (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100/70 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Sacred geometry backdrop ring */}
            <circle cx="100" cy="100" r="85" fill="none" stroke="#d4af37" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />
            
            {/* Pyramid Base Glow */}
            <polygon points="100,28 32,158 168,158" fill="url(#pyramidGlow)" opacity="0.25" />
            
            {/* 7 Layered Chakra Strips inside the Pyramid */}
            {/* Layer 7 (Crown - Violet) */}
            <polygon points="100,32 86,52 114,52" fill="#7E22CE" opacity="0.9" />
            {/* Layer 6 (Third Eye - Indigo) */}
            <polygon points="86,52 114,52 124,70 76,70" fill="#3730A3" opacity="0.9" />
            {/* Layer 5 (Throat - Cyan) */}
            <polygon points="76,70 124,70 134,88 66,88" fill="#0284C7" opacity="0.9" />
            {/* Layer 4 (Heart - Green) */}
            <polygon points="66,88 134,88 144,106 56,106" fill="#15803D" opacity="0.9" />
            {/* Layer 3 (Solar Plexus - Yellow/Gold) */}
            <polygon points="56,106 144,106 153,124 47,124" fill="#EAB308" opacity="0.9" />
            {/* Layer 2 (Sacral - Orange) */}
            <polygon points="47,124 153,124 161,142 39,142" fill="#EA580C" opacity="0.9" />
            {/* Layer 1 (Root - Red Jasper) */}
            <polygon points="39,142 161,142 168,158 32,158" fill="#B91C1C" opacity="0.9" />
            
            {/* Copper Sacred Spiral in Apex */}
            <path
              d="M100,56 Q106,62 100,70 Q92,76 100,84 Q110,92 100,102 Q88,110 100,122"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Pyramid Apex Light Beam */}
            <circle cx="100" cy="32" r="4" fill="#FEF08A" />
            <line x1="100" y1="18" x2="100" y2="32" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 2" />

            <defs>
              <linearGradient id="pyramidGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {visualType === 'bath-salt-health' && (
        <div className="w-full h-full bg-gradient-to-br from-rose-50 via-stone-100 to-amber-50 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Apothecary Jar Outline */}
            <rect x="62" y="38" width="76" height="14" rx="3" fill="#D97706" opacity="0.8" />
            <rect x="72" y="52" width="56" height="10" fill="#E2E8F0" opacity="0.6" />
            <path d="M52,62 L148,62 L148,160 Q148,168 140,168 L60,168 Q52,168 52,160 Z" fill="#FFFFFF" fillOpacity="0.8" stroke="#E2E8F0" strokeWidth="2" />
            
            {/* Pink Himalayan Salt Filling */}
            <path d="M54,92 Q100,86 146,92 L146,158 Q146,166 138,166 L62,166 Q54,166 54,158 Z" fill="#FDA4AF" opacity="0.85" />
            
            {/* Rose Petals & Salt Texture */}
            <circle cx="75" cy="110" r="3" fill="#E11D48" opacity="0.7" />
            <circle cx="115" cy="120" r="3.5" fill="#BE123C" opacity="0.8" />
            <circle cx="90" cy="138" r="2.8" fill="#E11D48" opacity="0.75" />
            <circle cx="130" cy="105" r="2.5" fill="#FB7185" opacity="0.9" />
            <circle cx="82" cy="150" r="2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="110" cy="145" r="2.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="125" cy="130" r="1.8" fill="#FFFFFF" opacity="0.9" />
            
            {/* Grandmaster Label */}
            <rect x="68" y="98" width="64" height="26" rx="2" fill="#FFFBEB" stroke="#D97706" strokeWidth="0.8" />
            <text x="100" y="109" textAnchor="middle" fontSize="6.5" fontWeight="600" fill="#92400E" letterSpacing="0.5">SHIVAMRIT</text>
            <text x="100" y="118" textAnchor="middle" fontSize="5.5" fill="#B45309">HEALTH BOOSTER</text>

            {/* Wooden scoop resting beside jar */}
            <path d="M142,165 L175,120 Q178,115 174,112 Q170,110 166,115 L136,158 Z" fill="#B45309" opacity="0.85" />
          </svg>
        </div>
      )}

      {visualType === 'bath-salt-cleanser' && (
        <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-100 to-slate-200 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Dark Apothecary Jar */}
            <rect x="62" y="38" width="76" height="14" rx="3" fill="#1E293B" />
            <rect x="72" y="52" width="56" height="10" fill="#334155" opacity="0.6" />
            <path d="M52,62 L148,62 L148,160 Q148,168 140,168 L60,168 Q52,168 52,160 Z" fill="#0F172A" opacity="0.9" stroke="#475569" strokeWidth="1.5" />
            
            {/* Tourmaline & Dead Sea Salt Texture */}
            <path d="M54,94 Q100,88 146,94 L146,158 Q146,166 138,166 L62,166 Q54,166 54,158 Z" fill="#334155" opacity="0.95" />
            <circle cx="80" cy="115" r="3" fill="#94A3B8" opacity="0.8" />
            <circle cx="120" cy="125" r="3" fill="#CBD5E1" opacity="0.8" />
            <circle cx="95" cy="142" r="2.5" fill="#E2E8F0" opacity="0.9" />
            
            {/* Shield emblem */}
            <path d="M100,102 L112,107 L112,120 Q100,130 100,130 Q88,120 88,107 Z" fill="#D4AF37" opacity="0.8" />
            <text x="100" y="145" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#F8FAFC" letterSpacing="0.8">AURA SHIELD</text>
          </svg>
        </div>
      )}

      {visualType === 'hair-oil' && (
        <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-stone-100 to-amber-50 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Herbal Dropper Bottle */}
            <rect x="94" y="24" width="12" height="16" rx="2" fill="#1C1917" />
            <rect x="88" y="40" width="24" height="8" rx="2" fill="#D4AF37" />
            <path d="M70,62 Q70,48 88,48 L112,48 Q130,48 130,62 L130,158 Q130,168 120,168 L80,168 Q70,168 70,158 Z" fill="#451A03" opacity="0.9" stroke="#78350F" strokeWidth="1.5" />
            
            {/* Golden Ayurvedic Nectar Liquid Fill */}
            <path d="M72,82 L128,82 L128,156 Q128,166 118,166 L82,166 Q72,166 72,156 Z" fill="#B45309" opacity="0.75" />

            {/* Label */}
            <rect x="76" y="94" width="48" height="42" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8" />
            <text x="100" y="106" textAnchor="middle" fontSize="5" fontWeight="600" fill="#78350F" letterSpacing="0.5">SHIVAMRIT</text>
            <text x="100" y="115" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#92400E">HAIR NECTAR</text>
            <text x="100" y="124" textAnchor="middle" fontSize="4.2" fill="#B45309">21 SACRED HERBS</text>

            {/* Botanical Rosemary / Bhringraj sprig */}
            <path d="M142,165 Q152,130 148,100" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="140" cy="115" rx="5" ry="3" fill="#16A34A" transform="rotate(-30 140 115)" />
            <ellipse cx="156" cy="125" rx="5" ry="3" fill="#16A34A" transform="rotate(30 156 125)" />
            <ellipse cx="144" cy="140" rx="5" ry="3" fill="#16A34A" transform="rotate(-25 144 140)" />
          </svg>
        </div>
      )}

      {visualType === 'kumkumadi' && (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-stone-100 to-orange-50 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Luminous Sun Rays Behind */}
            <circle cx="100" cy="110" r="55" fill="#FEF08A" opacity="0.3" />
            
            {/* Luxury Dropper Pipette */}
            <rect x="95" y="24" width="10" height="14" rx="2" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1" />
            <rect x="88" y="38" width="24" height="10" rx="2" fill="#D4AF37" />
            
            {/* Amber Glass Flacon */}
            <path d="M72,60 Q72,48 88,48 L112,48 Q128,48 128,60 L128,156 Q128,166 118,166 L82,166 Q72,166 72,156 Z" fill="#D97706" opacity="0.85" stroke="#F59E0B" strokeWidth="1.5" />
            
            {/* Pure Saffron Gold Liquid */}
            <path d="M74,78 L126,78 L126,154 Q126,164 116,164 L84,164 Q74,164 74,154 Z" fill="#F59E0B" opacity="0.9" />

            {/* Luxury Gold Foil Label */}
            <rect x="78" y="90" width="44" height="46" rx="2" fill="#FFFBEB" stroke="#B45309" strokeWidth="0.8" />
            <text x="100" y="103" textAnchor="middle" fontSize="5" fontWeight="600" fill="#92400E">KUMKUMADI</text>
            <text x="100" y="112" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#B45309">24K SAFFRON</text>
            <text x="100" y="121" textAnchor="middle" fontSize="4.2" fill="#78350F">DIVINE GLOW</text>
            <circle cx="100" cy="128" r="2" fill="#D4AF37" />

            {/* Saffron Stigma Stamen */}
            <path d="M142,165 Q158,150 162,125" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M148,165 Q164,145 154,120" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {visualType === 'rudraksha' && (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-stone-100 to-stone-200 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Concentric Mala Beads Strand */}
            <ellipse cx="100" cy="95" rx="65" ry="55" fill="none" stroke="#78350F" strokeWidth="1" strokeDasharray="1 5" />
            
            {/* Beads along an oval */}
            {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = 100 + 64 * Math.cos(rad);
              const y = 95 + 52 * Math.sin(rad);
              const isSphatik = i % 3 === 0;
              return (
                <g key={deg}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSphatik ? 6 : 7}
                    fill={isSphatik ? '#FFFFFF' : '#854D0E'}
                    stroke={isSphatik ? '#94A3B8' : '#713F12'}
                    strokeWidth="1.2"
                  />
                  {!isSphatik && (
                    <line x1={x - 3} y1={y - 4} x2={x + 3} y2={y + 4} stroke="#451A03" strokeWidth="1" />
                  )}
                </g>
              );
            })}

            {/* Guru Bead & Saffron Silk Tassel at bottom */}
            <circle cx="100" cy="148" r="9" fill="#713F12" stroke="#451A03" strokeWidth="1.5" />
            <rect x="97" y="157" width="6" height="5" fill="#D4AF37" />
            <path d="M96,162 L92,185 Q100,188 108,185 L104,162 Z" fill="#EA580C" />
          </svg>
        </div>
      )}

      {visualType === 'amethyst' && (
        <div className="w-full h-full bg-gradient-to-br from-purple-50 via-stone-100 to-indigo-50 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Rock Matrix Base */}
            <polygon points="40,155 70,165 140,165 165,150 150,135 50,135" fill="#475569" />
            
            {/* Crystal Terminations (Amethyst Geode points) */}
            <polygon points="65,140 55,90 75,70 85,120" fill="#9333EA" opacity="0.95" />
            <polygon points="75,70 85,120 95,65 85,45" fill="#A855F7" opacity="0.9" />
            
            {/* Tall Main Apex Crystal */}
            <polygon points="85,130 95,65 105,40 120,60 115,130" fill="#7E22CE" opacity="0.95" />
            <polygon points="105,40 120,60 125,120 115,130" fill="#6B21A8" opacity="0.9" />
            
            {/* Right Crystal Pillars */}
            <polygon points="115,130 125,75 140,85 135,135" fill="#9333EA" opacity="0.9" />
            <polygon points="135,135 140,85 152,100 148,145" fill="#C084FC" opacity="0.85" />

            {/* Sparkle highlights */}
            <circle cx="105" cy="40" r="3" fill="#FFFFFF" opacity="0.9" />
            <circle cx="75" cy="70" r="2.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="140" cy="85" r="2" fill="#FFFFFF" opacity="0.85" />
          </svg>
        </div>
      )}

      {visualType === 'karungali' && (
        <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Jet black ebony bracelet circle */}
            <ellipse cx="100" cy="100" rx="58" ry="46" fill="none" stroke="#292524" strokeWidth="1" strokeDasharray="2 3" />
            
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = 100 + 58 * Math.cos(rad);
              const y = 100 + 46 * Math.sin(rad);
              const isCopperSpacer = i === 0 || i === 6;
              return (
                <circle
                  key={deg}
                  cx={x}
                  cy={y}
                  r={isCopperSpacer ? 6 : 7.5}
                  fill={isCopperSpacer ? '#B45309' : '#1C1917'}
                  stroke={isCopperSpacer ? '#D97706' : '#44403C'}
                  strokeWidth="1.2"
                />
              );
            })}
            <text x="100" y="104" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#44403C" letterSpacing="0.8">EBONY WOOD</text>
          </svg>
        </div>
      )}

      {visualType === 'reiki-session' && (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-purple-50 to-indigo-100 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Radiant Spiritual Halo Rings */}
            <circle cx="100" cy="100" r="75" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#A855F7" strokeWidth="0.6" opacity="0.5" strokeDasharray="3 3" />
            
            {/* Meditating Silhouette */}
            <circle cx="100" cy="62" r="14" fill="#1C1917" opacity="0.85" />
            <path d="M78,135 Q78,92 100,90 Q122,92 122,135 Z" fill="#1C1917" opacity="0.85" />
            <path d="M60,148 Q80,132 100,135 Q120,132 140,148 Q100,158 60,148 Z" fill="#1C1917" opacity="0.85" />

            {/* Glowing 7 Chakras Line along spine */}
            <circle cx="100" cy="50" r="3.2" fill="#A855F7" /> {/* Crown */}
            <circle cx="100" cy="62" r="3" fill="#6366F1" />   {/* Third Eye */}
            <circle cx="100" cy="76" r="3" fill="#0EA5E9" />   {/* Throat */}
            <circle cx="100" cy="92" r="3.2" fill="#22C55E" /> {/* Heart */}
            <circle cx="100" cy="106" r="3" fill="#EAB308" />  {/* Solar Plexus */}
            <circle cx="100" cy="120" r="3" fill="#F97316" />  {/* Sacral */}
            <circle cx="100" cy="134" r="3.2" fill="#EF4444" /> {/* Root */}

            {/* Golden Healing Hands Rays */}
            <path d="M45,80 Q75,70 90,88" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M155,80 Q125,70 110,88" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </div>
      )}

      {visualType === 'singing-bowl' && (
        <div className="w-full h-full bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 max-h-48 drop-shadow-md">
            {/* Sonic Soundwave Rings */}
            <ellipse cx="100" cy="98" rx="80" ry="24" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.3" strokeDasharray="4 3" />
            <ellipse cx="100" cy="98" rx="66" ry="18" fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity="0.5" />

            {/* Singing Bowl Cushion */}
            <ellipse cx="100" cy="148" rx="44" ry="14" fill="#B91C1C" />
            <ellipse cx="100" cy="146" rx="40" ry="11" fill="#DC2626" />
            
            {/* Bronze Bowl Body */}
            <path d="M48,96 Q48,142 100,142 Q152,142 152,96 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
            <ellipse cx="100" cy="96" rx="52" ry="16" fill="#B45309" stroke="#D97706" strokeWidth="1.2" />
            <ellipse cx="100" cy="96" rx="46" ry="13" fill="#78350F" />

            {/* Wooden Striker */}
            <path d="M142,65 L175,128 Q178,132 174,134 Q170,136 166,132 L134,68 Z" fill="#451A03" />
            <rect x="156" y="108" width="16" height="18" rx="1" fill="#991B1B" transform="rotate(32 156 108)" />
          </svg>
        </div>
      )}
    </div>
  );
};
