import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Building,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Send,
} from 'lucide-react';
import qrCodeImg from '../../assets/qr code.jpeg';
import { paymentService } from '../../services/paymentService';

/**
 * PaymentModal
 *
 * Wide, responsive, landscape 2-column modal:
 * - Desktop/tablet: 2-column layout (QR + WhatsApp on left, Booking details + UTR + Status on right)
 * - Fits within standard screen height without forcing the user to scroll vertically
 * - Mobile: Stacks gracefully with optimized heights and clear contrast
 * - Authoritative 10-minute hold window countdown and real-time poller
 */
export function PaymentModal({
  isOpen,
  onClose,
  booking,
  advanceAmount = 750,
  onPaymentSuccess,
}) {
  const [copied, setCopied] = useState(false);
  const [upiRefInput, setUpiRefInput] = useState('');
  const [submittingRef, setSubmittingRef] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isHoldExpired, setIsHoldExpired] = useState(false);

  // Authoritative hold expiration time computation
  useEffect(() => {
    if (!isOpen) return;

    const expiresAt =
      statusData?.holdExpiresAt ||
      statusData?.expiresAt ||
      booking?.holdExpiresAt ||
      booking?.expiresAt;

    if (!expiresAt) {
      setTimeLeft(null);
      setIsHoldExpired(false);
      return;
    }

    const targetDate = new Date(expiresAt).getTime();

    const calculateRemaining = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        return { minutes: 0, seconds: 0, totalSeconds: 0 };
      }
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return { minutes, seconds, totalSeconds };
    };

    const initialRemaining = calculateRemaining();
    setTimeLeft(initialRemaining);
    if (initialRemaining && initialRemaining.totalSeconds <= 0) {
      setIsHoldExpired(true);
    } else {
      setIsHoldExpired(false);
    }

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);
      if (remaining && remaining.totalSeconds <= 0) {
        setIsHoldExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, statusData?.holdExpiresAt, statusData?.expiresAt, statusData?.status, statusData?.paymentStatus, booking]);

  const bookingRef = booking?.bookingId || 'PENDING';
  const bookingDbId = booking?._id;

  // Poll booking payment & confirmation status while modal is open
  useEffect(() => {
    if (!isOpen || !bookingDbId) return;

    setUpiRefInput(booking?.payment?.upiTransactionId || '');
    setStatusData({
      status: booking?.status || 'pending_payment',
      paymentStatus: booking?.payment?.status || 'pending',
      expiresAt: booking?.expiresAt,
      holdExpiresAt: booking?.holdExpiresAt || booking?.expiresAt,
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

          if (res.data.isExpired) {
            setIsHoldExpired(true);
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

    checkCurrentStatus();

    const interval = setInterval(() => {
      if (statusData?.status === 'confirmed' || statusData?.status === 'cancelled' || statusData?.isExpired) {
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
    e.preventDefault();
    if (!upiRefInput.trim()) {
      setErrorMessage('Please enter the 12-digit UPI reference / UTR number.');
      return;
    }

    if (isHoldExpired) {
      setErrorMessage('Your 10-minute hold has expired. Please select an available slot and rebook.');
      return;
    }

    setSubmittingRef(true);
    setErrorMessage('');
    setMessage('');

    try {
      const res = await paymentService.submitUpiPayment({
        bookingId: bookingDbId,
        upiTransactionId: upiRefInput.trim(),
      });

      if (res.success) {
        setMessage('UPI reference submitted successfully! Admin is verifying the payment.');
        if (res.data) {
          setStatusData(res.data);
        }
      } else {
        setErrorMessage(res.message || 'Failed to submit UPI reference. Please try again.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to submit transaction reference.';
      setErrorMessage(errMsg);
      if (err.response?.status === 409 && errMsg.toLowerCase().includes('expired')) {
        setIsHoldExpired(true);
      }
    } finally {
      setSubmittingRef(false);
    }
  };

  const theaterName = booking?.theater?.name || booking?.theaterName || 'Rio Party House';
  const roomName = booking?.roomName || booking?.room?.name || 'Private Theater';
  const bookingDate = booking?.date ? new Date(booking.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }) : '';
  const timeSlot = booking?.timeSlot || '';

  const handleManualCheck = async () => {
    if (!bookingDbId) return;
    setIsVerifying(true);
    setErrorMessage('');
    try {
      const res = await paymentService.checkStatus(bookingDbId);
      if (res.success && res.data) {
        setStatusData(res.data);
        if (res.data.isExpired) {
          setIsHoldExpired(true);
          setErrorMessage('This reservation hold has expired. Please select an available slot and rebook.');
        } else if (res.data.status === 'confirmed' || res.data.paymentStatus === 'paid') {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/65 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-[24px] border border-[#ead9ca] bg-[#FCF5EB] p-4 sm:p-5 md:p-6 text-left shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#ecdcd1] pb-3 shrink-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f4e6d9] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#8c5211]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#8c5211]" /> UPI Advance
              </span>
              <h3 className="text-[17px] sm:text-[20px] font-heading font-extrabold text-[#17171c] leading-tight">
                Complete Your Advance Payment
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {timeLeft && !isConfirmed && !isSubmitted && (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide shadow-sm ${
                    isHoldExpired
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#a9651c] text-amber-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {isHoldExpired ? (
                    <span>Hold Expired</span>
                  ) : (
                    <span>{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-[#8c5211] hover:bg-[#f4e6d9] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Hold Expired Warning Banner */}
          {isHoldExpired && !isConfirmed && (
            <div className="mt-2.5 shrink-0 rounded-[14px] bg-rose-50 border border-rose-300 p-2.5 text-rose-900 shadow-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-[12px] font-medium leading-tight">
                <strong className="font-bold">10-Minute Hold Expired:</strong> Your temporary hold has expired and the slot has been released. Please close, pick an available slot, and reserve again.
              </p>
            </div>
          )}

          {/* Flexible Two-Column Body: Left has QR & WhatsApp, Right has Summary, UTR form, and Status */}
          <div className="mt-3 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
              {/* LEFT COLUMN: QR Code + WhatsApp CTA */}
              <div className="md:col-span-5 flex flex-col gap-2.5">
                {/* QR Code Presentation */}
                <div className="rounded-[20px] bg-white border border-[#ead9ca] p-3 text-center shadow-sm">
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c5211]">
                      Scan UPI QR Code
                    </span>
                    <span className="text-[12px] font-extrabold text-[#a9651c]">
                      Pay ₹{advanceAmount}
                    </span>
                  </div>
                  <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-xl border border-dashed border-[#ead9ca] p-1.5 bg-white flex items-center justify-center overflow-hidden shadow-inner">
                    <img
                      src={qrCodeImg}
                      alt="CS Cinemas UPI QR Code"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-[#6b5c52] mt-2 leading-tight">
                    Scan with <strong>GPay, PhonePe, Paytm, BHIM</strong>
                  </p>
                  <p className="text-[10px] text-[#8c5211] mt-0.5">
                    Verify amount <strong>₹{advanceAmount}</strong> in your UPI app
                  </p>
                </div>

                {/* WhatsApp Payment Confirmation Card */}
                <div className="rounded-[18px] bg-white border border-[#ead9ca] p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E] shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                    </span>
                    <h4 className="text-[12px] font-heading font-extrabold text-[#17171c] truncate">
                      Share Screenshot on WhatsApp
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#6b5c52] leading-snug mb-2">
                    Send receipt screenshot to <strong className="text-[#17171c]">81478 97771</strong> for prompt confirmation.
                  </p>
                  <a
                    href={`https://wa.me/918147897771?text=${encodeURIComponent(
                      `Hello, I have completed my booking payment. Please find my payment confirmation screenshot attached. Kindly verify my payment and confirm my booking.\n\nBooking Reference: ${bookingRef}\nVenue: ${theaterName || ''}${roomName ? ` · ${roomName}` : ''}\nDate & Slot: ${bookingDate || ''} | ${timeSlot || ''}\nAmount Paid: ₹${advanceAmount}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-8 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-[11px] font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    <span>Send Screenshot on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Booking Summary + UTR Submission + Verification Status */}
              <div className="md:col-span-7 flex flex-col gap-2.5">
                {/* Advance Amount Callout Banner */}
                <div className="rounded-[18px] bg-gradient-to-r from-[#a9651c] to-[#8e5217] p-2.5 sm:p-3 text-white shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#fae1c8]">Advance Payable Now</p>
                    <p className="text-[22px] sm:text-[24px] font-extrabold tracking-tight leading-none mt-0.5">₹{advanceAmount}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                      Slot Reservation
                    </span>
                    <p className="text-[9px] text-[#fae1c8] mt-0.5">Balance due at venue</p>
                  </div>
                </div>

                {/* Booking Summary Reference Box */}
                <div className="rounded-[16px] bg-white border border-[#ecdcd1] p-2.5 sm:p-3 space-y-1.5 text-[11px] sm:text-[12px] shadow-sm">
                  {statusData?.isBulkBooking || booking?.isBulkBooking ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[#6b5c52] flex items-center gap-1.5 font-bold text-purple-900">
                          <Building className="h-3.5 w-3.5 text-purple-700" /> Bulk Group Booking
                        </span>
                        <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded text-[11px]">
                          {statusData?.bulkBookingId || booking?.bulkBookingId || 'Bulk Booking'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[#6b5c52]">
                        <span>Included Bookings</span>
                        <span className="font-bold text-[#1a1c21]">
                          {statusData?.bulkEntries?.length || booking?.bulkCount || booking?.bookings?.length || 1} Rooms / Slots
                        </span>
                      </div>
                      {statusData?.bulkEntries && statusData.bulkEntries.length > 0 && (
                        <div className="max-h-24 overflow-y-auto space-y-1 pr-1 border-t border-dashed border-[#ecdcd1] pt-1">
                          {statusData.bulkEntries.map((entry) => (
                            <div key={entry.bookingId} className="flex justify-between text-[10px]">
                              <span className="text-[#6b5c52] truncate max-w-[170px]">{entry.theaterName} · {entry.roomName}</span>
                              <span className="font-semibold text-[#8c5211]">{entry.timeSlot}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-[#6b5c52] flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-[#8c5211]" /> Venue & Room
                        </span>
                        <span className="font-bold text-[#1a1c21] truncate max-w-[220px]">
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
                    </>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-[#f4e7da]">
                    <span className="text-[#6b5c52]">Booking Reference</span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="font-mono font-bold text-[#8c5211] hover:text-[#a9651c] flex items-center gap-1 text-[11px] sm:text-[12px]"
                      title="Click to copy"
                    >
                      {statusData?.bulkBookingId || booking?.bulkBookingId || bookingRef}
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* UPI Transaction Reference Submission Form */}
                <form onSubmit={handleSubmitUpi} className="rounded-[16px] bg-white border border-[#ead9ca] p-2.5 sm:p-3 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label htmlFor="upiRef" className="text-[11px] sm:text-[12px] font-bold text-[#1a1c21] flex items-center gap-1.5">
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
                      placeholder={isHoldExpired ? 'Hold window has expired' : 'e.g. 408219349812 or UTR No'}
                      disabled={isConfirmed || isHoldExpired}
                      className="flex-1 h-9 sm:h-10 px-3 text-[12px] rounded-lg border border-[#ead9ca] bg-[#fdfcf9] font-mono text-[#1a1c21] outline-none focus:border-[#a9651c] focus:ring-1 focus:ring-[#a9651c]/20 disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={submittingRef || isConfirmed || isHoldExpired || !upiRefInput.trim()}
                      className="h-9 sm:h-10 px-3.5 rounded-lg bg-[#a9651c] hover:bg-[#8e5217] text-white text-[11px] sm:text-[12px] font-bold transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
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
                    After paying in UPI, paste your 12-digit UTR/Ref and click submit.
                  </p>
                </form>

                {/* Status Indicator */}
                <div className="rounded-[14px] bg-[#f9f2eb] border border-[#ead9ca] p-2 sm:p-2.5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    {isConfirmed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : isSubmitted ? (
                      <Clock className="h-4 w-4 text-[#8c5211] shrink-0" />
                    ) : isRejected ? (
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#1a1c21] truncate">
                        {isConfirmed
                          ? 'Payment Verified & Booking Confirmed!'
                          : isSubmitted
                          ? 'Submitted — Awaiting Admin Verification'
                          : isRejected
                          ? 'Payment Verification Rejected'
                          : 'Awaiting Payment & UPI Reference'}
                      </p>
                      <p className="text-[9px] text-[#6b5c52] truncate">
                        {isConfirmed
                          ? 'Your private theater slot is confirmed!'
                          : isSubmitted
                          ? 'Admin will check merchant bank statement.'
                          : isRejected
                          ? 'Please review transaction reference and try again.'
                          : 'Scan QR and submit UTR to verify.'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualCheck}
                    disabled={isVerifying}
                    className="text-[10px] font-bold text-[#8c5211] hover:text-[#a9651c] flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#ead9ca] bg-white transition disabled:opacity-50 shrink-0 ml-1.5"
                  >
                    <RefreshCw className={`h-2.5 w-2.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {message && (
                  <div className="rounded-[12px] bg-emerald-50 border border-emerald-200 p-2 text-[11px] text-emerald-800 flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600" />
                    <span>{message}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-[12px] bg-red-50 border border-red-200 p-2 text-[11px] text-red-700 flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-2.5 pt-2 border-t border-[#ecdcd1] flex items-center justify-between shrink-0">
            <p className="text-[10px] text-[#8c7767] hidden sm:block">
              Your slot reservation is protected while payment verification is underway.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto h-8 sm:h-9 px-6 rounded-full border border-[#ead9ca] bg-white hover:bg-[#f9f2eb] text-[#6b5c52] text-[12px] font-bold transition shadow-sm ml-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PaymentModal;
