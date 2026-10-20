import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RefreshCw, ShoppingBag } from 'lucide-react';
import { evaluateChakraDiagnostic, type ChakraQuizAnswers } from '../utils/storeLogic';
import { PRODUCTS, type Product } from '../data/products';
import { ProductVisual } from './ProductVisual';

interface ChakraQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ChakraQuizModal: React.FC<ChakraQuizModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onSelectProduct,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [answers, setAnswers] = useState<ChakraQuizAnswers>({
    primaryStruggle: 'anxiety',
    energyGoal: 'deep_peace',
    preferredRitual: 'meditation',
  });

  if (!isOpen) return null;

  const prescription = evaluateChakraDiagnostic(answers);
  const matchedProduct = PRODUCTS.find((p) => p.id === prescription.recommendedProductId) || PRODUCTS[0];

  const handleReset = () => {
    setStep(1);
    setAnswers({
      primaryStruggle: 'anxiety',
      energyGoal: 'deep_peace',
      preferredRitual: 'meditation',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif text-lg tracking-wide">Chakra & Aura Diagnostic</h3>
              <p className="text-xs text-amber-200/80">Guided by Grandmaster Parul Suthar's Energetic Principles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Diagnostic"
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-xs text-amber-800 font-semibold tracking-wider uppercase">Step 1 of 3</div>
              <h4 className="font-serif text-2xl text-stone-900">What is your primary physical or emotional challenge right now?</h4>
              <div className="space-y-2.5">
                {[
                  { id: 'anxiety', label: 'Restless mind, racing thoughts, insomnia or anxiety' },
                  { id: 'fatigue', label: 'Chronic physical fatigue, heavy limbs, burnout or low stamina' },
                  { id: 'heartbreak', label: 'Emotional sorrow, relationship hurt, grief or lack of self-love' },
                  { id: 'expression', label: 'Throat tension, fear of speaking truth, social hesitation' },
                  { id: 'lack_clarity', label: 'General confusion, feeling disconnected or ungrounded' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, primaryStruggle: opt.id as any }));
                      setStep(2);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                      answers.primaryStruggle === opt.id
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium shadow-sm'
                        : 'border-stone-200 bg-white hover:border-amber-400 text-stone-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="text-xs text-amber-800 font-semibold tracking-wider uppercase">Step 2 of 3</div>
              <h4 className="font-serif text-2xl text-stone-900">What is the highest energy state you wish to call into your life?</h4>
              <div className="space-y-2.5">
                {[
                  { id: 'deep_peace', label: 'Unshakable peace of mind and peaceful deep sleep' },
                  { id: 'vitality', label: 'Radiant physical health, stamina, and active life prana' },
                  { id: 'protection', label: 'Impenetrable psychic shielding from negative or jealous vibes' },
                  { id: 'love', label: 'Heart healing, compassion, warmth, and forgiveness' },
                  { id: 'spiritual_connection', label: 'Deeper meditation, intuition, and divine guidance' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, energyGoal: opt.id as any }));
                      setStep(3);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                      answers.energyGoal === opt.id
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium shadow-sm'
                        : 'border-stone-200 bg-white hover:border-amber-400 text-stone-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="text-xs text-amber-800 font-semibold tracking-wider uppercase">Step 3 of 3</div>
              <h4 className="font-serif text-2xl text-stone-900">Which daily healing ritual feels most comforting to you?</h4>
              <div className="space-y-2.5">
                {[
                  { id: 'bath', label: 'Warm mineral bath or evening foot soak with aromatic sacred salts' },
                  { id: 'meditation', label: 'Quiet silent contemplation with natural energized crystals' },
                  { id: 'wearing', label: 'Wearing consecrated sacred malas or protective bracelets daily' },
                  { id: 'oil_massage', label: 'Evening scalp or facial botanical oil massage with sacred mantras' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, preferredRitual: opt.id as any }));
                      setStep(4);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                      answers.preferredRitual === opt.id
                        ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium shadow-sm'
                        : 'border-stone-200 bg-white hover:border-amber-400 text-stone-800'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Assessment Complete
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              </div>

              {/* Prescription Card */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 md:p-5 space-y-3">
                <div className="text-xs text-amber-800 font-medium">Primary Energetic Imbalance</div>
                <h4 className="font-serif text-2xl text-stone-900 leading-tight">
                  {prescription.chakraName} <span className="text-sm font-sans text-stone-500 font-normal">({prescription.sanskritName})</span>
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">{prescription.reason}</p>
                <div className="p-3 bg-white/90 rounded-lg border border-amber-100 text-xs text-stone-800 italic">
                  &ldquo;{prescription.affirmation}&rdquo;
                </div>
              </div>

              {/* Matched Product Callout */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-stone-100 bg-stone-50">
                  <ProductVisual visualType={matchedProduct.visualType} imageUrl={matchedProduct.imageUrl} alt={matchedProduct.name} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-xs text-stone-500 uppercase tracking-wider">{matchedProduct.category}</div>
                  <div className="font-serif text-lg font-semibold text-stone-900 leading-snug">{matchedProduct.name}</div>
                  <div className="text-xs text-amber-900 font-medium mt-1">₹{matchedProduct.priceInr.toLocaleString('en-IN')}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onSelectProduct(matchedProduct);
                      onClose();
                    }}
                    className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(matchedProduct);
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
