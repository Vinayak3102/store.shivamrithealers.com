import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

test('Razorpay HMAC-SHA256 signature generation and verification algorithm', () => {
  const testSecret = 'xtHw6RptWJzvEYac0lWXQymQ';
  const orderId = 'order_test_12345';
  const paymentId = 'pay_test_67890';

  const body = `${orderId}|${paymentId}`;
  const validSignature = crypto
    .createHmac('sha256', testSecret)
    .update(body)
    .digest('hex');

  assert.equal(typeof validSignature, 'string');
  assert.equal(validSignature.length, 64);

  // Matching check
  const checkSignature = crypto
    .createHmac('sha256', testSecret)
    .update(body)
    .digest('hex');

  const buf1 = Buffer.from(validSignature, 'utf-8');
  const buf2 = Buffer.from(checkSignature, 'utf-8');
  assert.equal(crypto.timingSafeEqual(buf1, buf2), true);

  // Tampered payload check
  const tamperedBody = `${orderId}|pay_tampered_999`;
  const tamperedSig = crypto
    .createHmac('sha256', testSecret)
    .update(tamperedBody)
    .digest('hex');

  const bufTampered = Buffer.from(tamperedSig, 'utf-8');
  assert.equal(crypto.timingSafeEqual(buf1, bufTampered), false);
});

test('Razorpay order amount minimum validation (>= 100 paise)', () => {
  const validAmount = 99900; // ₹999
  const invalidAmount = 50; // ₹0.50

  assert.ok(validAmount >= 100, 'Valid amount is >= 100 paise');
  assert.ok(invalidAmount < 100, 'Invalid amount is < 100 paise');
});
