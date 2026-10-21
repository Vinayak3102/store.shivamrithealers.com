/**
 * ShivAmrit Healers — Node.js Production Server
 * Includes Razorpay Standard Web Checkout API Endpoints:
 * - POST /api/create-order
 * - POST /api/verify-payment
 */

import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import Razorpay from 'razorpay';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Parse JSON request bodies
app.use(express.json());

// Initialize Razorpay client with credentials from environment
const getRazorpayClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials missing in environment variables');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// -------------------------------------------------------------
// STEP 1: BACKEND - Create Order
// Endpoint: POST /api/create-order
// -------------------------------------------------------------
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    const parsedAmount = Math.round(Number(amount));
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    if (parsedAmount < 100) {
      return res.status(400).json({
        error: 'Amount must be at least 100 paise (₹1)',
      });
    }

    let razorpay;
    try {
      razorpay = getRazorpayClient();
    } catch (authErr) {
      console.error('Razorpay Auth/Env Error:', authErr);
      return res.status(401).json({
        error: 'Razorpay configuration error: Invalid or missing credentials',
      });
    }

    const orderOptions = {
      amount: parsedAmount,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {
        store: 'ShivAmrit Healers',
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    if (error?.statusCode === 401 || (error?.error?.code === 'BAD_REQUEST_ERROR' && error?.message?.includes('auth'))) {
      return res.status(401).json({
        error: error?.error?.description || 'Authentication failed with Razorpay API',
      });
    }

    return res.status(500).json({
      error: error?.error?.description || error?.message || 'Failed to create Razorpay order',
    });
  }
});

// -------------------------------------------------------------
// STEP 3: BACKEND - Verify Payment Signature
// Endpoint: POST /api/verify-payment
// -------------------------------------------------------------
app.post('/api/verify-payment', (req, res) => {
  try {
    const order_id = req.body.order_id || req.body.razorpay_order_id;
    const payment_id = req.body.payment_id || req.body.razorpay_payment_id;
    const signature = req.body.signature || req.body.razorpay_signature;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: order_id, payment_id, and signature are required',
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: RAZORPAY_KEY_SECRET is not configured',
      });
    }

    // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const body = `${order_id}|${payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(signature, 'utf-8');
    const isSignatureValid =
      expectedBuffer.length === signatureBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

    if (isSignatureValid) {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order_id,
        payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed: Invalid signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return res.status(400).json({
      success: false,
      error: 'Invalid signature verification data',
    });
  }
});

app.get('/api/payment-config', (_req, res) => {
  return res.json({
    key_id: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '',
  });
});

// Serve static assets from dist/
app.use(
  express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// SPA Fallback: Any route not matching a static file returns index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ ShivAmrit Healers running on port ${PORT}`);
  console.log(`📍 Serving from: ${distPath}`);
  console.log(`💳 Razorpay Checkout endpoints active:`);
  console.log(`   - POST /api/create-order`);
  console.log(`   - POST /api/verify-payment`);
});
