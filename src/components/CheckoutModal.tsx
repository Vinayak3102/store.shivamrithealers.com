import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowLeft,
  PackageCheck,
  QrCode,
  Sparkles,
  Lock,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import type { CartLineItem } from './CartDrawer';
import { FREE_SHIPPING_LIMIT, logoImg } from '../data/storeProducts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartLineItem[];
  onOrderSuccess: () => void;
}

// Razorpay Key ID (frontend public key)
const RAZORPAY_KEY_ID =
  (import.meta as any).env?.VITE_RAZORPAY_KEY_ID ||
  (import.meta as any).env?.RAZORPAY_KEY_ID ||
  'rzp_test_TqRijVWiANkpat';

// Dynamic script loader for Razorpay Checkout
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [coupon, setCoupon] = useState('SHIVAMRIT10');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = subtotal >= FREE_SHIPPING_LIMIT ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'SHIVAMRIT10') {
      setCouponApplied(true);
    }
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setErrorMessage('Please fill in your name, contact phone, street address, and PIN code.');
      return;
    }
    setErrorMessage('');
    setStep('payment');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // -------------------------------------------------------------
  // STEP 2 & 3: FRONTEND - Call create-order & verify-payment
  // -------------------------------------------------------------
  const handleInitiatePayment = async () => {
    setErrorMessage('');

    if (paymentMethod === 'cod') {
      // Cash on Delivery flow
      const codOrderId = `SH-COD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(codOrderId);
      setPaymentId(`COD-PENDING`);
      setStep('confirmed');
      onOrderSuccess();
      return;
    }

    // Step 2: Online Razorpay Standard Web Checkout
    setIsProcessing(true);

    try {
      // Ensure SDK script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error('Unable to load the Razorpay checkout script. Please check your internet connection.');
      }

      // 1. Call Backend to Create Order (POST /api/create-order)
      const amountInPaise = Math.max(100, grandTotal * 100);
      const createOrderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `sh_rcpt_${Date.now()}`,
          notes: {
            customer_name: name,
            customer_phone: phone,
            shipping_address: `${address}, ${city} - ${pincode}`,
          },
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || `Server error (${createOrderRes.status}): Failed to initialize payment order`);
      }

      // 2. Open Razorpay Standard Checkout Modal with backend order_id
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'ShivAmrit Healers',
        description: `Order ${orderData.order_id} • Consecrated Spiritual Artifacts`,
        image: logoImg || '/assets/logo.png',
        order_id: orderData.order_id, // Essential: links checkout session to backend order
        prefill: {
          name: name,
          email: email.trim() || `${phone.replace(/\D/g, '')}@shivamrithealers.com`,
          contact: phone,
        },
        notes: {
          address: `${address}, ${city} - ${pincode}`,
          order_id: orderData.order_id,
        },
        theme: {
          color: '#18283e', // ShivAmrit brand navy
        },
        // Step 3: Handle Success & Send to Backend Signature Verification
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id || orderData.order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyRes.json();

            if (!verifyRes.ok || !verifyResult.success) {
              throw new Error(
                verifyResult.error || 'Payment signature verification failed. Please contact support.'
              );
            }

            // Successfully verified!
            setIsProcessing(false);
            setPaymentId(response.razorpay_payment_id);
            setOrderId(response.razorpay_order_id || orderData.order_id);
            setStep('confirmed');
            onOrderSuccess();
          } catch (verifyError: any) {
            setIsProcessing(false);
            setErrorMessage(
              `Verification Alert: ${verifyError.message || 'Signature mismatch. Order not completed.'}`
            );
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setErrorMessage('Payment modal closed. You can retry or choose Cash on Delivery.');
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      // Handle payment.failed event
      razorpayInstance.on('payment.failed', function (failureResponse: any) {
        setIsProcessing(false);
        const reason =
          failureResponse?.error?.description ||
          failureResponse?.error?.reason ||
          'Payment could not be completed by your bank/UPI app.';
        setErrorMessage(`Payment Failed: ${reason}`);
      });

      razorpayInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      console.error('Razorpay Checkout Error:', err);
      setErrorMessage(err?.message || 'Error communicating with payment server. Please try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl text-slate-900 border border-slate-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-gradient-to-r from-[#121e30] via-[#18283e] to-[#121e30] text-white">
          <div className="flex items-center gap-2">
            {step === 'payment' && (
              <button
                onClick={() => {
                  setStep('details');
                  setErrorMessage('');
                }}
                className="mr-1 p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
                aria-label="Back to details"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <Sparkles className="size-5 text-[#f3d37a]" />
            <h2 id="checkout-title" className="font-serif text-lg md:text-xl font-medium tracking-wide">
              {step === 'confirmed' ? 'Order Confirmed & Blessed' : 'Secure Sacred Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1">
                <strong className="block font-semibold">Notice:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmitDetails} className="space-y-5">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#18283e] mb-3 flex items-center justify-between">
                  <span>1. Consecration & Shipping Address</span>
                  <span className="text-[11px] font-sans font-normal text-slate-500">
                    Insured Express Delivery across India
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Full Name for Vedic Blessing *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Parul Suthar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18283e] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18283e] focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Email Address (Optional for Invoice & Tracking)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18283e] focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Street Address & Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Flat, House no., Building, Street area"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18283e] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Surat, Mumbai, Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18283e] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 395001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18283e] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Sacred Blessing Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#18283e]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
                  >
                    {couponApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    ✓ 10% Consecration discount applied (-₹{discountAmount})
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-[#fbf9f5] p-4 rounded-xl text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Vedic Blessing Discount (SHIVAMRIT10)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Insured Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : '₹99'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#18283e] pt-2 border-t border-slate-200">
                  <span>Payable Grand Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#18283e] hover:bg-[#121e30] text-white py-3.5 rounded-xl text-xs font-bold tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment Method</span>
                <span>→</span>
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#18283e] mb-1">
                  2. Select Payment Method
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Powered by <strong>Razorpay Standard Web Checkout</strong> (API Verified).
                </p>

                <div className="space-y-3">
                  {/* Option 1: Razorpay Standard Web Checkout */}
                  <label
                    className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === 'online'
                        ? 'border-[#18283e] bg-slate-50/80 shadow-md ring-1 ring-[#18283e]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="mt-1 text-[#18283e] focus:ring-[#18283e]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <QrCode className="size-4 text-[#e07038]" />
                          <span>Razorpay Standard Checkout (UPI • Cards • NetBanking)</span>
                        </div>
                        <p className="text-[11.5px] text-slate-600 mt-1">
                          Google Pay, PhonePe, Paytm, QR Code, RuPay, Visa, Mastercard, NetBanking & Wallets.
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10.5px] text-slate-500">
                          <Lock className="size-3 text-emerald-600" />
                          <span>256-bit Encrypted • HMAC Signature Verified</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                      Recommended
                    </span>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-[#18283e] bg-slate-50/80 shadow-md ring-1 ring-[#18283e]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-1 text-[#18283e] focus:ring-[#18283e]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <Truck className="size-4 text-slate-600" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-[11.5px] text-slate-600 mt-1">
                          Pay cash upon verified delivery at your doorstep across India.
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Payable Amount:</span>
                  <span className="text-base text-[#18283e]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Shipping to: <strong>{name}</strong> • {address}, {city} ({pincode})
                </p>
                <p className="text-[10.5px] text-amber-800 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="size-3.5 text-amber-600 shrink-0" />
                  <span>Razorpay Key: {RAZORPAY_KEY_ID}</span>
                </p>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleInitiatePayment}
                className="w-full bg-gradient-to-r from-[#d26726] to-[#e07038] hover:from-[#bf5b1f] hover:to-[#ce622d] text-white py-3.5 rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Connecting Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className="size-4" />
                    <span>
                      {paymentMethod === 'online'
                        ? `Pay Securely with Razorpay (₹${grandTotal.toLocaleString('en-IN')})`
                        : `Confirm COD Order (₹${grandTotal.toLocaleString('en-IN')})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="text-center py-6 space-y-4">
              <div className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#18283e]">
                Thank you, {name}!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your sacred order has been confirmed. Grandmaster Parul Suthar will personally cleanse each gemstone under moonlight and chant the Vedic Shiv Panchakshari frequencies prior to express dispatch.
              </p>

              <div className="bg-[#fbf9f5] border border-slate-200 rounded-xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Razorpay Order ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#18283e]">{orderId}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(orderId)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    </button>
                  </div>
                </div>

                {paymentId && (
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500">Payment ID:</span>
                    <span className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {paymentId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-500">Signature Verification:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    <span>Verified (HMAC-SHA256)</span>
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Sacred Items:</span>
                  <span className="font-semibold text-slate-800">{items.length} unique pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">
                    {paymentMethod === 'online' ? 'Razorpay Standard Checkout ✓' : 'Pay on Delivery (COD)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Address:</span>
                  <span className="font-semibold text-right text-slate-800 truncate max-w-[220px]">
                    {address}, {city} - {pincode}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 pt-2">
                <ShieldCheck className="size-4" /> Live tracking notification dispatched to {phone}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 bg-[#18283e] text-white px-8 py-3 rounded-xl text-xs font-semibold hover:bg-[#121e30] transition shadow cursor-pointer"
              >
                Return to Storefront
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
