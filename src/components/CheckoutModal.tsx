import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, ArrowLeft, PackageCheck, QrCode } from 'lucide-react';
import type { CartLineItem } from './CartDrawer';
import { FREE_SHIPPING_LIMIT } from '../data/storeProducts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartLineItem[];
  onOrderSuccess: () => void;
}

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
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [orderId, setOrderId] = useState('');

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
    if (!name || !phone || !address || !pincode) return;
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const generatedId = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setStep('confirmed');
    onOrderSuccess();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl text-slate-900 border border-slate-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#18283e] text-white">
          <div className="flex items-center gap-2">
            {step === 'payment' && (
              <button
                onClick={() => setStep('details')}
                className="mr-2 p-1 rounded-full hover:bg-white/10"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <h2 id="checkout-title" className="font-serif text-xl font-medium tracking-wide">
              {step === 'confirmed' ? 'Order Confirmed!' : 'Secure Express Checkout'}
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
          {step === 'details' && (
            <form onSubmit={handleSubmitDetails} className="space-y-5">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#18283e] mb-3">
                  1. Consecration & Delivery Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Parul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#18283e]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Mobile (for WhatsApp dispatch) *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#18283e]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="parul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#18283e]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">Street Address, Flat / House No. *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House no., Landmark, Street area..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#18283e]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">City / Town *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Mumbai / Delhi / Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#18283e]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">PIN Code *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 400001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-[#18283e]"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Row */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (try SHIVAMRIT10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-slate-800 text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-slate-900"
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
              <div className="bg-[#fbf9f5] p-4 rounded-lg text-xs space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Vedic Blessing Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Insured Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : '₹99'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#18283e] pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#18283e] hover:bg-[#121e30] text-white py-3 rounded-lg text-xs font-semibold tracking-wide transition shadow"
              >
                Continue to Payment Method →
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#18283e] mb-3">
                  2. Select Sacred Payment Mode
                </h3>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                      paymentMethod === 'upi' ? 'border-[#18283e] bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-[#18283e]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <QrCode className="size-4 text-[#e07038]" /> UPI / Instant QR / GPay / PhonePe
                        </div>
                        <p className="text-[11px] text-slate-500">Scan QR or enter UPI ID with zero gateway fees</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Instant Confirmation
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                      paymentMethod === 'card' ? 'border-[#18283e] bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-[#18283e]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <CreditCard className="size-4 text-[#18283e]" /> Debit / Credit Card / NetBanking
                        </div>
                        <p className="text-[11px] text-slate-500">All major Indian banks and RuPay / Visa / Mastercard</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition ${
                      paymentMethod === 'cod' ? 'border-[#18283e] bg-slate-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-[#18283e]"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <Truck className="size-4 text-slate-600" /> Cash on Delivery (COD)
                        </div>
                        <p className="text-[11px] text-slate-500">Pay cash upon verified delivery at doorstep</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Payable Total:</span>
                  <span className="text-base text-[#18283e]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Delivering to: <strong>{name}</strong> • {city}, {pincode}
                </p>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full bg-[#e07038] hover:bg-[#c95e28] text-white py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
              >
                <PackageCheck className="size-4" />
                Place Consecrated Order (₹{grandTotal.toLocaleString('en-IN')})
              </button>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="text-center py-6 space-y-4">
              <div className="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#18283e]">
                Thank you, {name}!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your sacred order has been received. Our Reiki Grandmaster Parul Suthar will cleanse and consecrate each gemstone bracelet with Vedic mantras prior to dispatch.
              </p>

              <div className="bg-[#fbf9f5] border border-slate-200 rounded-lg p-5 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-[#18283e]">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Items:</span>
                  <span className="font-semibold text-slate-800">{items.length} unique pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-semibold capitalize text-slate-800">{paymentMethod.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping Address:</span>
                  <span className="font-semibold text-right text-slate-800 truncate max-w-[200px]">{city}, {pincode}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Paid:</span>
                  <span className="text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 pt-2">
                <ShieldCheck className="size-4" /> Tracking link will be messaged to {phone}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 bg-[#18283e] text-white px-8 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#121e30] transition"
              >
                Back to Storefront
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
