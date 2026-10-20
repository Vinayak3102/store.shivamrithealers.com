/**
 * Core business and calculation logic for ShivAmrit Healers E-Commerce Store.
 * Decoupled from UI components for pure unit testing and deterministic calculations.
 */

export interface CartItem {
  id: string;
  name: string;
  category: string;
  priceInr: number;
  originalPriceInr: number;
  quantity: number;
  chakra: string;
}

export type Currency = 'INR' | 'USD';

export const INR_TO_USD_RATE = 0.0122; // ~ ₹82 = $1 USD
export const FREE_SHIPPING_THRESHOLD_INR = 999;
export const STANDARD_SHIPPING_INR = 99;

export function formatPrice(amountInr: number, currency: Currency = 'INR'): string {
  if (currency === 'USD') {
    const usd = Math.round(amountInr * INR_TO_USD_RATE);
    return `$${usd}`;
  }
  return `₹${amountInr.toLocaleString('en-IN')}`;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.priceInr * item.quantity, 0);
}

export function calculateOriginalTotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.originalPriceInr * item.quantity, 0);
}

export function validateCoupon(code: string, subtotalInr: number): { valid: boolean; discountPercent: number; message: string } {
  const normalized = code.trim().toUpperCase();
  if (normalized === 'SHIVA10') {
    return { valid: true, discountPercent: 10, message: 'Divine Blessings: 10% discount applied!' };
  }
  if (normalized === 'BLISS15') {
    if (subtotalInr >= 2000) {
      return { valid: true, discountPercent: 15, message: 'Sacred Abundance: 15% discount applied!' };
    }
    return { valid: false, discountPercent: 0, message: 'Coupon BLISS15 requires a minimum order of ₹2,000.' };
  }
  if (normalized === 'FREESHIP') {
    return { valid: true, discountPercent: 0, message: 'Complimentary consecrated express shipping applied!' };
  }
  return { valid: false, discountPercent: 0, message: 'Invalid or expired blessing coupon code.' };
}

export function calculateCartSummary(items: CartItem[], couponCode: string = '', currency: Currency = 'INR') {
  const subtotalInr = calculateSubtotal(items);
  const originalTotalInr = calculateOriginalTotal(items);
  const couponResult = couponCode ? validateCoupon(couponCode, subtotalInr) : { valid: false, discountPercent: 0, message: '' };

  const discountAmountInr = couponResult.valid ? Math.round((subtotalInr * couponResult.discountPercent) / 100) : 0;
  const isFreeShipCoupon = couponCode.trim().toUpperCase() === 'FREESHIP';
  
  const qualifiesForFreeShipping = subtotalInr >= FREE_SHIPPING_THRESHOLD_INR || isFreeShipCoupon || items.length === 0;
  const shippingInr = (items.length === 0 || qualifiesForFreeShipping) ? 0 : STANDARD_SHIPPING_INR;
  
  const finalTotalInr = Math.max(0, subtotalInr - discountAmountInr + shippingInr);
  const totalSavingsInr = Math.max(0, originalTotalInr - subtotalInr + discountAmountInr);

  return {
    subtotalInr,
    originalTotalInr,
    discountAmountInr,
    shippingInr,
    finalTotalInr,
    totalSavingsInr,
    qualifiesForFreeShipping,
    amountNeededForFreeShippingInr: Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotalInr),
    couponResult,
    subtotalFormatted: formatPrice(subtotalInr, currency),
    discountFormatted: formatPrice(discountAmountInr, currency),
    shippingFormatted: shippingInr === 0 ? 'FREE' : formatPrice(shippingInr, currency),
    finalTotalFormatted: formatPrice(finalTotalInr, currency),
    savingsFormatted: formatPrice(totalSavingsInr, currency),
  };
}

export interface ChakraQuizAnswers {
  primaryStruggle: 'anxiety' | 'fatigue' | 'heartbreak' | 'expression' | 'lack_clarity';
  energyGoal: 'deep_peace' | 'vitality' | 'protection' | 'love' | 'spiritual_connection';
  preferredRitual: 'bath' | 'meditation' | 'wearing' | 'oil_massage';
}

export interface ChakraPrescription {
  chakraName: string;
  sanskritName: string;
  theme: string;
  affirmation: string;
  recommendedProductId: string;
  reason: string;
}

export function evaluateChakraDiagnostic(answers: ChakraQuizAnswers): ChakraPrescription {
  if (answers.primaryStruggle === 'fatigue' || answers.energyGoal === 'vitality') {
    return {
      chakraName: 'Solar Plexus & Root',
      sanskritName: 'Manipura & Muladhara',
      theme: 'Vital Energy, Grounding & Restorative Power',
      affirmation: 'I am grounded in sacred strength. Divine life force flows effortlessly through every cell.',
      recommendedProductId: 'bath-salt-health',
      reason: 'Your auric field indicates depleted prana and energetic exhaustion. The Reiki-Infused Health Booster Bath Salt draws out deep fatigue through osmotic mineral cleansing.',
    };
  }

  if (answers.primaryStruggle === 'heartbreak' || answers.energyGoal === 'love') {
    return {
      chakraName: 'Heart Chakra',
      sanskritName: 'Anahata',
      theme: 'Unconditional Compassion, Emotional Release & Inner Harmony',
      affirmation: 'My heart space is open, peaceful, and bathed in unconditional divine light.',
      recommendedProductId: 'chakra-pyramid',
      reason: 'Emotional heaviness and vulnerability need gentle realignment. The 7-Chakra Orgone Pyramid stabilizes emotional waves and radiates steady heart-centered frequencies.',
    };
  }

  if (answers.primaryStruggle === 'anxiety' || answers.energyGoal === 'deep_peace') {
    return {
      chakraName: 'Crown & Third Eye',
      sanskritName: 'Sahasrara & Ajna',
      theme: 'Mental Stillness, Psychic Shielding & Divine Intuition',
      affirmation: 'My mind is a serene sanctuary. I am safe, peaceful, and spiritually protected.',
      recommendedProductId: 'amethyst-cluster',
      reason: 'Excess nervous energy and mental chatter suggest an overactive crown and clouded third eye. The consecrated Brazilian Amethyst transmutes erratic vibrations into serene stillness.',
    };
  }

  if (answers.primaryStruggle === 'expression') {
    return {
      chakraName: 'Throat Chakra',
      sanskritName: 'Vishuddha',
      theme: 'Authentic Truth, Divine Speech & Clear Expression',
      affirmation: 'I speak my sacred truth with clarity, kindness, and unwavering confidence.',
      recommendedProductId: 'rudraksha-mala',
      reason: 'Throat constriction blocks creative truth. The Nepali 5-Mukhi Rudraksha with pure Sphatik crystal restores vocal resonance and inner certainty.',
    };
  }

  // Default / Lack of clarity
  return {
    chakraName: 'All 7 Sacred Energy Centers',
    sanskritName: 'Sapta Chakra System',
    theme: 'Holistic Realignment, Shielding & Awakening',
    affirmation: 'All my chakras spin in radiant harmony with the universal source of divine light.',
    recommendedProductId: 'chakra-pyramid',
    reason: 'A full-spectrum rebalancing will reset your subtle energy channels (Nadis) and fortify your protective aura.',
  };
}
