import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  QrCode,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Building,
  Copy,
  Check,
  RefreshCw,
  Send,
} from 'lucide-react';
import qrCodeImg from '../../assets/qr code.jpeg';
import { paymentService } from '../../services/paymentService';

export function PaymentModal({
  isOpen,
  onClose,
  booking,
  theaterName,
  roomName,
  bookingDate,
  timeSlot,
  advanceAmount = 750,
  onPaymentSuccess,
}) {
  const [copied, setCopied] = useState(false);
  const [upiRefInput, setUpiRefInput] = useState('');
  const [submittingRef, setSubmittingRef] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const bookingRef = booking?.bookingId || 'PENDING';
  const bookingDbId = booking?._id;

  // Poll booking payment & confirmation status while modal is open
  useEffect(() => {
    if (!isOpen || !bookingDbId) return;

    // Reset local states on modal open
    setUpiRefInput(booking?.payment?.upiTransactionId || '');
    setStatusData({
      status: booking?.status || 'pending_payment',
      paymentStatus: booking?.payment?.status || 'pending',
    });
    setErrorMessage('');
    setMessage('');

    let isMounted = true;

    const checkCurrentStatus = async () => {
      try {
        const res = await paymentService.checkStatus(bookingDbId);
        if (!isMounted) return;
        if (res.success && res.data) {
          setStatusData(res.data);
          if (res.data.upiTransactionId && !upiRefInput) {
            setUpiRefInput(res.data.upiTransactionId);
          }

          if (res.data.status === 'confirmed' || res.data.paymentStatus === 'paid') {
            setTimeout(() => {
              if (onPaymentSuccess) onPaymentSuccess(bookingDbId);
            }, 1200);
          }
        }
      } catch (err) {
        // Silently retry on interval
      }
    };

    // Immediate check
    checkCurrentStatus();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      // Stop polling once confirmed or cancelled
      if (statusData?.status === 'confirmed' || statusData?.status === 'cancelled') {
        clearInterval(interval);
        return;
      }
      checkCurrentStatus();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, bookingDbId]);

  const handleCopyRef = () => {
    if (!bookingRef) return;
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitUpi = async (e) => {
    e?.preventDefault();
    if (!upiRefInput.trim()) {
      setErrorMessage('Please enter the 12-digit UPI transaction reference or UTR number from your payment app.');
      return;
    }

    setSubmittingRef(true);
    setErrorMessage('');
    setMessage('');

    try {
      const res = await paymentService.submitUpi({
        bookingId: bookingDbId,
        upiTransactionId: upiRefInput.trim(),
      });

      if (res.success) {
        setMessage('UPI reference submitted! Admin will verify and confirm your slot shortly.');
        setStatusData((prev) => ({
          ...prev,
          status: 'pending_verification',
          paymentStatus: 'submitted',
          upiTransactionId: upiRefInput.trim(),
        }));
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Failed to submit UPI reference. Please try again.');
    } finally {
      setSubmittingRef(false);
    }
  };

  const handleManualCheck = async () => {
    if (!bookingDbId) return;
    setIsVerifying(true);
    setErrorMessage('');
    try {
      const res = await paymentService.checkStatus(bookingDbId);
      if (res.success && res.data) {
        setStatusData(res.data);
        if (res.data.status === 'confirmed' || res.data.paymentStatus === 'paid') {
          setMessage('Payment verified! Booking confirmed.');
          setTimeout(() => {
            if (onPaymentSuccess) onPaymentSuccess(bookingDbId);
          }, 1000);
        } else if (res.data.paymentStatus === 'submitted') {
          setMessage('Transaction submitted — awaiting admin bank verification.');
        } else if (res.data.paymentStatus === 'rejected') {
          setErrorMessage(`Payment rejected: ${res.data.rejectedReason || 'Could not verify transaction in bank account.'}`);
        } else {
          setMessage('Status: Awaiting UPI payment & reference submission.');
        }
      }
    } catch (err) {
      setErrorMessage('Unable to query verification status right now. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  const currentStatus = statusData?.status || booking?.status || 'pending_payment';
  const currentPaymentStatus = statusData?.paymentStatus || booking?.payment?.status || 'pending';
  const isConfirmed = currentStatus === 'confirmed' || currentPaymentStatus === 'paid';
  const isSubmitted = currentPaymentStatus === 'submitted' || currentStatus === 'pending_verification';
  const isRejected = currentPaymentStatus === 'rejected' || currentPaymentStatus === 'failed';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-[28px] border border-[#ead9ca] bg-[#FCF5EB] p-5 sm:p-7 text-left shadow-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#ecdcd1] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e6d9] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8c5211] mb-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#8c5211]" /> UPI Advance Payment
              </div>
              <h3 className="text-[22px] font-heading font-extrabold text-[#17171c] leading-tight">
                Complete Your Advance Payment
              </h3>
              <p className="text-[12px] text-[#6b5c52] mt-1">
                Scan QR via any UPI app, pay ₹{advanceAmount}, and submit your transaction reference.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[#8c5211] hover:bg-[#f4e6d9] transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Amount Callout */}
          <div className="my-4 rounded-[20px] bg-gradient-to-r from-[#a9651c] to-[#8e5217] p-4 text-white shadow-md flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#fae1c8]">Advance Payable Now</p>
              <p className="text-[28px] font-extrabold tracking-tight">₹{advanceAmount}</p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wide">
                Slot Reservation
              </span>
              <p className="text-[10px] text-[#fae1c8] mt-1">Remaining balance due at venue</p>
            </div>
          </div>

          {/* QR Code Presentation */}
          <div className="rounded-[22px] bg-white border border-[#ead9ca] p-4 text-center shadow-sm">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#8c5211] mb-2">
              Scan UPI QR Code
            </p>
            <div className="mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl border-2 border-dashed border-[#ead9ca] p-2 bg-white flex items-center justify-center overflow-hidden shadow-inner">
              <img
                src={qrCodeImg}
                alt="CS Cinemas UPI QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <p className="text-[12px] font-medium text-[#6b5c52] mt-3">
              Scan using <strong>GPay, PhonePe, Paytm, BHIM</strong> or any UPI app.
            </p>
            <p className="text-[11px] text-[#8c5211] mt-1">
              Please verify amount <strong>₹{advanceAmount}</strong> in your UPI application before authorizing.
            </p>
          </div>

          {/* WhatsApp Payment Confirmation Card */}
          <div className="mt-4 rounded-[22px] bg-white border border-[#ead9ca] p-4 sm:p-5 text-left shadow-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </span>
              <h4 className="text-[14px] sm:text-[15px] font-heading font-extrabold text-[#17171c]">
                Share Your Payment Confirmation
              </h4>
            </div>

            <p className="text-[12px] leading-relaxed text-[#6b5c52] mb-2.5">
              Once your payment is successful, please take a screenshot of your payment confirmation and send it to us on WhatsApp to help us verify your payment and confirm your booking.
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8c5211] mb-3">
              <span>WhatsApp Number:</span>
              <span className="font-mono font-bold text-[#17171c]">81478 97771</span>
            </div>

            <a
              href={`https://wa.me/918147897771?text=${encodeURIComponent(
                `Hello, I have completed my booking payment. Please find my payment confirmation screenshot attached. Kindly verify my payment and confirm my booking.\n\nBooking Reference: ${bookingRef}\nVenue: ${theaterName || ''}${roomName ? ` · ${roomName}` : ''}\nDate & Slot: ${bookingDate || ''} | ${timeSlot || ''}\nAmount Paid: ₹${advanceAmount}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-[13px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              <span>Send Payment Screenshot on WhatsApp</span>
            </a>

            <p className="mt-2 text-[11px] text-center text-[#8c7767]">
              Please attach your payment screenshot in WhatsApp before sending the message.
            </p>
          </div>

          {/* Booking Summary Reference Box */}
          <div className="mt-4 rounded-[18px] bg-white/80 border border-[#ecdcd1] p-3.5 space-y-2 text-[12px]">
            <div className="flex justify-between items-center">
              <span className="text-[#6b5c52] flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-[#8c5211]" /> Venue & Room
              </span>
              <span className="font-bold text-[#1a1c21] truncate max-w-[200px]">
                {theaterName} · {roomName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6b5c52] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#8c5211]" /> Date & Slot
              </span>
              <span className="font-bold text-[#1a1c21]">
                {bookingDate} | {timeSlot}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#f4e7da]">
              <span className="text-[#6b5c52]">Booking Reference</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="font-mono font-bold text-[#8c5211] hover:text-[#a9651c] flex items-center gap-1 text-[12px]"
                title="Click to copy"
              >
                {bookingRef}
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* UPI Transaction Reference Submission Form */}
          <form onSubmit={handleSubmitUpi} className="mt-4 rounded-[18px] bg-white border border-[#ead9ca] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="upiRef" className="text-[12px] font-bold text-[#1a1c21] flex items-center gap-1.5">
                UPI Reference / UTR Number *
              </label>
              <span className="text-[10px] text-[#8c5211]">From your UPI receipt</span>
            </div>
            <div className="flex gap-2">
              <input
                id="upiRef"
                type="text"
                value={upiRefInput}
                onChange={(e) => setUpiRefInput(e.target.value)}
                placeholder="e.g. 408219349812 or UTR No"
                disabled={isConfirmed}
                className="flex-1 h-10 px-3.5 text-[12px] rounded-xl border border-[#ead9ca] bg-[#fdfcf9] font-mono text-[#1a1c21] outline-none focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={submittingRef || isConfirmed || !upiRefInput.trim()}
                className="h-10 px-4 rounded-xl bg-[#a9651c] hover:bg-[#8e5217] text-white text-[12px] font-bold transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
              >
                {submittingRef ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {isSubmitted ? 'Update Ref' : 'Submit Ref'}
              </button>
            </div>
            <p className="text-[10px] text-[#6b5c52]">
              After paying in GPay/PhonePe/Paytm, copy the 12-digit UPI Ref/UTR and click submit.
            </p>
          </form>

          {/* Current Status Indicator */}
          <div className="mt-4 rounded-[16px] bg-[#f9f2eb] border border-[#ead9ca] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {isConfirmed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : isSubmitted ? (
                <Clock className="h-5 w-5 text-[#8c5211] shrink-0" />
              ) : isRejected ? (
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-slate-400 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#1a1c21] truncate">
                  {isConfirmed
                    ? 'Payment Verified & Booking Confirmed!'
                    : isSubmitted
                    ? 'Payment Submitted — Awaiting Verification'
                    : isRejected
                    ? 'Payment Verification Rejected'
                    : 'Awaiting Payment & UPI Reference'}
                </p>
                <p className="text-[10px] text-[#6b5c52] truncate">
                  {isConfirmed
                    ? 'Your private theater slot is confirmed!'
                    : isSubmitted
                    ? 'Admin will check the merchant bank statement.'
                    : isRejected
                    ? 'Please review transaction reference and try again.'
                    : 'Scan the QR code and submit UTR to verify.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleManualCheck}
              disabled={isVerifying}
              className="text-[11px] font-bold text-[#8c5211] hover:text-[#a9651c] flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#ead9ca] bg-white transition disabled:opacity-50 shrink-0 ml-2"
            >
              <RefreshCw className={`h-3 w-3 ${isVerifying ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {message && (
            <div className="mt-3 rounded-[14px] bg-emerald-50 border border-emerald-200 p-2.5 text-[12px] text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 rounded-[14px] bg-red-50 border border-red-200 p-2.5 text-[12px] text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto h-11 px-8 rounded-full border border-[#ead9ca] bg-white hover:bg-[#f9f2eb] text-[#6b5c52] text-[13px] font-bold transition shadow-sm"
            >
              Close
            </button>
          </div>

          <p className="mt-3 text-[10px] text-center text-[#8c7767]">
            Note: Your slot reservation is protected while payment verification is underway.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
