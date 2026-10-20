import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice,
  calculateSubtotal,
  validateCoupon,
  calculateCartSummary,
  evaluateChakraDiagnostic,
  type CartItem,
} from './storeLogic.ts';

test('formatPrice correctly formats INR and USD', () => {
  assert.equal(formatPrice(1000, 'INR'), '₹1,000');
  assert.equal(formatPrice(2499, 'INR'), '₹2,499');
  assert.equal(formatPrice(1000, 'USD'), '$12');
});

test('calculateSubtotal accurately calculates total price', () => {
  const mockItems: CartItem[] = [
    { id: '1', name: 'Pyramid', category: 'Crystals', priceInr: 1499, originalPriceInr: 2499, quantity: 2, chakra: 'All' },
    { id: '2', name: 'Bath Salt', category: 'Salts', priceInr: 649, originalPriceInr: 899, quantity: 1, chakra: 'Solar Plexus' },
  ];
  assert.equal(calculateSubtotal(mockItems), 1499 * 2 + 649);
});

test('validateCoupon handles SHIVA10, BLISS15 threshold, and invalid codes', () => {
  const result1 = validateCoupon('SHIVA10', 1000);
  assert.equal(result1.valid, true);
  assert.equal(result1.discountPercent, 10);

  const result2Under = validateCoupon('BLISS15', 1500);
  assert.equal(result2Under.valid, false);

  const result2Over = validateCoupon('BLISS15', 2500);
  assert.equal(result2Over.valid, true);
  assert.equal(result2Over.discountPercent, 15);

  const invalid = validateCoupon('RANDOMCODE', 1000);
  assert.equal(invalid.valid, false);
});

test('calculateCartSummary handles free shipping threshold and discounts', () => {
  const singleItem: CartItem[] = [
    { id: '1', name: 'Bath Salt', category: 'Salts', priceInr: 649, originalPriceInr: 899, quantity: 1, chakra: 'Solar Plexus' },
  ];
  const summary1 = calculateCartSummary(singleItem, '', 'INR');
  assert.equal(summary1.subtotalInr, 649);
  assert.equal(summary1.qualifiesForFreeShipping, false);
  assert.equal(summary1.shippingInr, 99);
  assert.equal(summary1.finalTotalInr, 748);

  // With 2 items, exceeds ₹999 threshold:
  const twoItems: CartItem[] = [
    { id: '1', name: 'Bath Salt', category: 'Salts', priceInr: 649, originalPriceInr: 899, quantity: 2, chakra: 'Solar Plexus' },
  ];
  const summary2 = calculateCartSummary(twoItems, 'SHIVA10', 'INR');
  assert.equal(summary2.subtotalInr, 1298);
  assert.equal(summary2.qualifiesForFreeShipping, true);
  assert.equal(summary2.shippingInr, 0);
  assert.equal(summary2.discountAmountInr, 130); // 10% of 1298 rounded
  assert.equal(summary2.finalTotalInr, 1298 - 130);
});

test('evaluateChakraDiagnostic maps struggles to targeted chakra prescriptions', () => {
  const fatigueResult = evaluateChakraDiagnostic({
    primaryStruggle: 'fatigue',
    energyGoal: 'vitality',
    preferredRitual: 'bath',
  });
  assert.equal(fatigueResult.recommendedProductId, 'bath-salt-health');
  assert.match(fatigueResult.chakraName, /Solar Plexus/);

  const anxietyResult = evaluateChakraDiagnostic({
    primaryStruggle: 'anxiety',
    energyGoal: 'deep_peace',
    preferredRitual: 'meditation',
  });
  assert.equal(anxietyResult.recommendedProductId, 'amethyst-cluster');
  assert.match(anxietyResult.chakraName, /Crown & Third Eye/);
});
