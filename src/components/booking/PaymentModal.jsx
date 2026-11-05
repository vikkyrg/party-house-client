import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { settingService } from '../../services/settingService';
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
  Sparkles,
} from 'lucide-react';
import qrCodeImg from '../../assets/qr code.jpeg';
import { paymentService } from '../../services/paymentService';

/**
 * PaymentModal
 *
 * Static UPI QR payment modal with customer-entered claims and admin verification.
 */
export function PaymentModal({
  isOpen,
  onClose,
  booking,
  advanceAmount = 750,
  onPaymentSuccess,
  theaterName: propTheaterName,
  roomName: propRoomName,
  bookingDate: propBookingDate,
  timeSlot: propTimeSlot,
  upiId: propUpiId,
}) {
  const [copied, setCopied] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [upiRefInput, setUpiRefInput] = useState('');
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [upiId, setUpiId] = useState(propUpiId || '');
  const [upiSettingsError, setUpiSettingsError] = useState('');
  const [submittingRef, setSubmittingRef] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusWarning, setStatusWarning] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isHoldExpired, setIsHoldExpired] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');
  const paymentSubmissionInProgress = useRef(false);
  const statusCheckInProgress = useRef(false);

  useEffect(() => {
    if (!isOpen || !booking?._id) {
      setWhatsAppUrl('');
      return undefined;
    }
    setWhatsAppUrl('');

    let isMounted = true;
    if (propUpiId) {
      setUpiId(propUpiId);
      setUpiSettingsError('');
      return undefined;
    }
    setUpiId('');
    setUpiSettingsError('');
    settingService.getPaymentSettings()
      .then((response) => {
        if (isMounted) setUpiId(propUpiId || response.data?.upiId || '');
      })
      .catch(() => {
        if (isMounted) {
          setUpiSettingsError('UPI ID is unavailable; scan the static QR and check the payee name before paying.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, propUpiId, booking?._id]);

  // Authoritative hold expiration time computation
  useEffect(() => {
    if (!isOpen) return;

    if (statusData?.status === 'confirmed') {
      setTimeLeft(null);
      setIsHoldExpired(false);
      return;
    }

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
    const bookingTotal = Number(booking?.pricing?.total || 0);
    const bookingAdvanceAmount = Number(booking?.pricing?.advanceAmount ?? advanceAmount) || 0;
    setPaymentAmountInput(
      bookingTotal > 0
        ? String(Math.min(bookingAdvanceAmount, bookingTotal))
        : String(bookingAdvanceAmount || '')
    );
    setStatusData({
      status: booking?.status || 'pending_payment',
      paymentStatus: booking?.payment?.status || 'pending',
      expiresAt: booking?.expiresAt,
      holdExpiresAt: booking?.holdExpiresAt || booking?.expiresAt,
    });
    setErrorMessage('');
    setStatusWarning('');
    setMessage('');

    let isMounted = true;
    let interval;

    const checkCurrentStatus = async () => {
      if (statusCheckInProgress.current) return;
      statusCheckInProgress.current = true;
      try {
        const res = await paymentService.checkStatus(bookingDbId);
        if (!isMounted) return;
        if (res.success && res.data) {
          setStatusWarning('');
          setStatusData(res.data);
          if (res.data.upiTransactionId && !upiRefInput) {
            setUpiRefInput(res.data.upiTransactionId);
          }

          if (res.data.isExpired) {
            setIsHoldExpired(true);
            setErrorMessage('Your reservation hold has expired. Please select an available slot and rebook.');
            clearInterval(interval);
          } else if (res.data.status === 'cancelled') {
            setErrorMessage('This booking was cancelled and is no longer available for payment.');
            clearInterval(interval);
          }

          if (Number(res.data.paymentSummary?.remainingBalance) === 0 && onPaymentSuccess) {
            setTimeout(() => {
              onPaymentSuccess(bookingDbId);
            }, 1500);
          }
        }
      } catch (err) {
        if ([400, 403, 404].includes(err?.response?.status)) {
          setErrorMessage(err.response?.data?.message || 'Booking session expired or not found. Please choose an available time slot.');
          clearInterval(interval);
        } else {
          setStatusWarning('Payment status could not be refreshed due to a temporary connection issue. Your payment is not marked verified; try Refresh again.');
        }
      } finally {
        statusCheckInProgress.current = false;
      }
    };

    checkCurrentStatus();

    interval = setInterval(() => {
      checkCurrentStatus();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, bookingDbId, advanceAmount, booking?.pricing?.advanceAmount]);

  const handleCopyRef = () => {
    const textToCopy = statusData?.bulkBookingId || booking?.bulkBookingId || bookingRef;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      setErrorMessage('Unable to copy the UPI ID. Please copy it manually.');
    }
  };

  const currentStatus = statusData?.status || booking?.status || 'pending_payment';
  const currentPaymentStatus = statusData?.paymentStatus || booking?.payment?.status || 'pending';
  const paymentSummary = statusData?.paymentSummary || booking?.paymentSummary || {};
  const totalBookingAmount = Number(paymentSummary.totalBookingAmount ?? booking?.pricing?.total ?? 0);
  const verifiedPaidAmount = Number(
    paymentSummary.verifiedAmountPaid ?? booking?.payment?.amountPaid ?? 0
  );
  const pendingVerificationAmount = Number(paymentSummary.pendingVerificationAmount ?? 0);
  const remainingBalance = Number(
    paymentSummary.remainingBalance ?? Math.max(0, totalBookingAmount - verifiedPaidAmount)
  );
  const isConfirmed = totalBookingAmount > 0 && remainingBalance <= 0;
  const isBookingConfirmed = currentStatus === 'confirmed';
  const isSubmitted = pendingVerificationAmount > 0 ||
    currentPaymentStatus === 'submitted' ||
    currentPaymentStatus === 'pending_verification' ||
    currentStatus === 'pending_verification';
  const isRejected = ['rejected', 'failed', 'payment_rejected'].includes(currentPaymentStatus);
  const submittedPayments = statusData?.paymentRecords || booking?.paymentRecords || [];
  const latestSubmittedPayment = submittedPayments[submittedPayments.length - 1];

  const theaterName = propTheaterName || booking?.theater?.name || booking?.theaterName || 'Rio Party House';
  const roomName = propRoomName || booking?.roomName || booking?.room?.name || 'Private Theater';
  const rawDate = propBookingDate || booking?.date || booking?.bookingDate;
  const bookingDate = rawDate ? new Date(rawDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }) : '';
  const timeSlot = propTimeSlot || booking?.timeSlot || '';
  const parsedPaymentAmount = Number(paymentAmountInput);
  const canCreateUpiIntent =
    Boolean(upiId) &&
    Number.isFinite(parsedPaymentAmount) &&
    parsedPaymentAmount >= 1 &&
    parsedPaymentAmount <= remainingBalance &&
    Math.round(parsedPaymentAmount * 100) === parsedPaymentAmount * 100;
  const upiIntentParams = new URLSearchParams({
    pa: upiId,
    pn: theaterName,
    am: canCreateUpiIntent ? parsedPaymentAmount.toFixed(2) : '',
    cu: 'INR',
    tn: `Booking ${bookingRef}`,
  });
  const upiIntentQuery = upiIntentParams.toString();
  const upiIntentUrl = canCreateUpiIntent ? `upi://pay?${upiIntentQuery}` : '';
  const upiAppOptions = [
    {
      label: 'Google Pay',
      href: `tez://upi/pay?${upiIntentQuery}`,
      icon: 'G',
      iconClass: 'bg-white text-[#4285f4] border border-slate-200',
    },
    {
      label: 'PhonePe',
      href: `phonepe://pay?${upiIntentQuery}`,
      icon: 'P',
      iconClass: 'bg-[#5f259f] text-white',
    },
    {
      label: 'Paytm',
      href: `paytmmp://pay?${upiIntentQuery}`,
      icon: '₹',
      iconClass: 'bg-[#00baf2] text-white',
    },
    {
      label: 'Other UPI Apps',
      href: upiIntentUrl,
      icon: 'UPI',
      iconClass: 'bg-[#138808] text-white',
    },
  ];

  const handleSubmitUpi = async (e) => {
    e.preventDefault();
    if (paymentSubmissionInProgress.current) return;
    const submittedAmount = Number(paymentAmountInput);
    if (
      !Number.isFinite(submittedAmount) ||
      submittedAmount < 1 ||
      Math.round(submittedAmount * 100) !== submittedAmount * 100
    ) {
      setErrorMessage('Enter a payment amount of at least ₹1, with no more than two decimal places.');
      return;
    }
    if (submittedAmount > remainingBalance) {
      setErrorMessage(
        `Payment amount cannot exceed the remaining balance of ₹${remainingBalance.toLocaleString('en-IN')}.`
      );
      return;
    }
    const trimmedUtr = upiRefInput.trim();
    if (!trimmedUtr) {
      setErrorMessage('Please enter the UPI transaction reference / UTR number.');
      return;
    }
    if (trimmedUtr.length < 6 || trimmedUtr.length > 35) {
      setErrorMessage('UPI transaction references must be between 6 and 35 characters.');
      return;
    }
    if (!bookingDbId) {
      setErrorMessage('The booking could not be identified. Please refresh and try again.');
      return;
    }

    if (isHoldExpired) {
      setErrorMessage('Your 10-minute hold has expired. Please select an available slot and rebook.');
      return;
    }

    paymentSubmissionInProgress.current = true;
    setSubmittingRef(true);
    setErrorMessage('');
    setMessage('');
    setWhatsAppUrl('');

    try {
      const res = await paymentService.submitUpiPayment({
        bookingId: bookingDbId,
        paymentAmount: submittedAmount,
        transactionReference: trimmedUtr,
      });

      if (res.success) {
        setMessage(
          `Payment claim of ₹${submittedAmount.toLocaleString('en-IN')} submitted. It is awaiting admin verification.`
        );
        if (res.data) {
          setStatusData(res.data);
        }

        // Build WhatsApp notification message with actual saved booking & payment information
        const summaryTotal = Number(res.data?.paymentSummary?.totalBookingAmount ?? totalBookingAmount);
        const summaryVerified = Number(res.data?.paymentSummary?.verifiedAmountPaid ?? verifiedPaidAmount);
        const summaryPending = Number(res.data?.paymentSummary?.pendingVerificationAmount ?? submittedAmount);
        const summaryRemaining = Math.max(0, summaryTotal - summaryVerified - summaryPending);

        const whatsappMessage = [
          'NEW BOOKING PAYMENT RECEIVED',
          '',
          'A customer has submitted a booking payment.',
          '',
          'BOOKING DETAILS:',
          `Booking ID: ${bookingRef || 'N/A'}`,
          `Customer Name: ${booking?.customerDetails?.name || booking?.user?.name || 'Customer'}`,
          `Customer Mobile: ${booking?.customerDetails?.phone || booking?.user?.phone || 'N/A'}`,
          `Venue: ${theaterName || 'Rio Party House'}`,
          `Room: ${roomName || 'Sigma'}`,
          `Booking Date: ${bookingDate || 'N/A'}`,
          `Time Slot: ${timeSlot || 'N/A'}`,
          '',
          'PAYMENT DETAILS:',
          `Total Booking Amount: ₹${summaryTotal.toLocaleString('en-IN')}`,
          `Advance Amount Paid (pending verification): ₹${submittedAmount.toLocaleString('en-IN')}`,
          `Verified Paid: ₹${summaryVerified.toLocaleString('en-IN')}`,
          `Pending Verification: ₹${summaryPending.toLocaleString('en-IN')}`,
          `Remaining Balance (after verification): ₹${summaryRemaining.toLocaleString('en-IN')}`,
          `UPI Reference / UTR: ${trimmedUtr}`,
        ].join('\n');

        const singleWhatsAppUrl = `https://wa.me/918147897771?text=${encodeURIComponent(whatsappMessage)}`;
        setWhatsAppUrl(singleWhatsAppUrl);

        // Open single WhatsApp chat for +91 81478 97771
        try {
          window.open(singleWhatsAppUrl, '_blank', 'noopener,noreferrer');
        } catch {
          // Popup blocked by browser; clickable link is visible below
        }

        setUpiRefInput('');
        setPaymentAmountInput('');
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
      paymentSubmissionInProgress.current = false;
      setSubmittingRef(false);
    }
  };

  const handleManualCheck = async () => {
    if (!bookingDbId || statusCheckInProgress.current) return;
    statusCheckInProgress.current = true;
    setIsVerifying(true);
    setErrorMessage('');
    setStatusWarning('');
    try {
      const res = await paymentService.checkStatus(bookingDbId);
      if (res.success && res.data) {
        setStatusWarning('');
        setStatusData(res.data);
        if (res.data.isExpired) {
          setIsHoldExpired(true);
          setErrorMessage('This reservation hold has expired. Please select an available slot and rebook.');
        } else if (Number(res.data.paymentSummary?.remainingBalance) === 0) {
          setMessage('Payment verified! Booking confirmed.');
          setTimeout(() => {
            if (onPaymentSuccess) onPaymentSuccess(bookingDbId);
          }, 1200);
        } else if (res.data.status === 'confirmed') {
          setMessage(
            `Required advance verified. Booking confirmed; remaining balance is ₹${Number(res.data.paymentSummary?.remainingBalance || 0).toLocaleString('en-IN')}.`
          );
        } else if (Number(res.data.paymentSummary?.pendingVerificationAmount) > 0) {
          setMessage('Payment submitted — awaiting admin verification.');
        } else if (res.data.paymentStatus === 'submitted') {
          setMessage('Transaction submitted — awaiting admin bank verification.');
        } else if (['rejected', 'payment_rejected'].includes(res.data.paymentStatus)) {
          const latestPayment = res.data.paymentRecords?.[res.data.paymentRecords.length - 1];
          setErrorMessage(`Payment rejected: ${latestPayment?.rejectionReason || res.data.rejectedReason || 'Could not verify transaction in bank account.'}`);
        } else {
          setMessage('Status: Awaiting UPI payment & reference submission.');
        }
      }
    } catch (err) {
      if ([400, 403, 404].includes(err?.response?.status)) {
        setErrorMessage(err.response?.data?.message || 'Unable to access this booking payment status.');
      } else {
        setStatusWarning('Payment status could not be refreshed due to a temporary connection issue. Your payment is not marked verified; try Refresh again.');
      }
    } finally {
      statusCheckInProgress.current = false;
      setIsVerifying(false);
    }
  };

  if (!isOpen || !bookingDbId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[820px] max-h-[92vh] flex flex-col rounded-3xl bg-white border border-[#ebdcd0] shadow-[0_25px_60px_-15px_rgba(23,23,28,0.25)] overflow-hidden my-auto"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[#f2e7de] bg-[#fdfaf6] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-[#8c5211] shadow-xs">
                <ShieldCheck className="h-5 w-5 text-[#8c5211]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#a9651c]">
                    UPI PAYMENT
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-extrabold text-[#17171c] leading-tight">
                  Pay Your Booking Balance
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {timeLeft && !isConfirmed && !isSubmitted && (
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-tight shadow-xs ${
                    isHoldExpired
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-100/80 text-[#8c5211] border border-amber-300/60'
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
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-[#f3e9de] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hold Expired Warning Banner */}
          {isHoldExpired && !isConfirmed && (
            <div className="mx-5 sm:mx-7 mt-4 shrink-0 rounded-2xl bg-rose-50 border border-rose-200 p-3 text-rose-900 shadow-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                <strong className="font-bold">Hold Expired:</strong> Your 10-minute slot hold has expired. Please close this modal, choose an available slot, and reserve again.
              </p>
            </div>
          )}

          {/* Success State Overlay if Verified */}
          {isConfirmed ? (
            <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center flex-1 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Payment Verified
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">₹{totalBookingAmount.toLocaleString('en-IN')} Paid</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-md">
                Your booking reference <strong className="font-mono text-[#8c5211]">{statusData?.bulkBookingId || booking?.bulkBookingId || bookingRef}</strong> is fully paid and confirmed.
              </p>
            </div>
          ) : (
            /* Modal Content: 2-Column Desktop, 1-Column Mobile */
            <div className="p-5 sm:p-7 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
                
                {/* Left Column: QR Code */}
                <div className="hidden md:col-span-5 md:flex flex-col gap-3.5">
                  {/* QR Card */}
                  <div className="hidden rounded-2xl border border-[#ebdcd0] bg-[#fcf8f4]/60 p-4 text-center shadow-xs flex-col items-center md:flex">
                    <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#f0e4da]">
                      <span className="text-xs font-bold tracking-tight text-slate-700">Static UPI QR</span>
                      <span className="text-sm font-extrabold text-[#9e5e1e]">Advance ₹{advanceAmount}</span>
                    </div>

                    <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl bg-white p-2 border border-[#ebdcd0] shadow-sm flex items-center justify-center">
                      <img
                        src={qrCodeImg}
                        alt="Rio Party House UPI QR Code"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    <p className="text-xs font-semibold text-slate-700 mt-3">
                      Scan with any UPI App
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Enter your chosen amount manually in your UPI app. The static QR does not contain an amount.
                    </p>
                    {upiId && (
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#ebdcd0] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#8c5211] hover:bg-[#fdfaf7]"
                      >
                        {upiCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {upiCopied ? 'UPI ID copied' : `Copy UPI ID: ${upiId}`}
                      </button>
                    )}
                    {upiSettingsError && (
                      <p className="mt-2 text-[10px] text-amber-800">{upiSettingsError}</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Amount Badge, Booking Details, UTR input, Status */}
                <div className="md:col-span-7 flex flex-col gap-3.5">
                  <section className="md:hidden rounded-2xl border border-[#ebdcd0] bg-[#fcf8f4]/70 p-3.5" aria-label="UPI payment options">
                    <h4 className="text-sm font-extrabold text-slate-900">Pay with a UPI app</h4>
                    <p className="mt-1 text-[11px] text-slate-600">
                      Pay ₹{paymentAmountInput ? Number(paymentAmountInput).toLocaleString('en-IN') : '—'} to {theaterName}. Return here to submit your UTR.
                    </p>
                    {upiId ? (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {upiAppOptions.map((option) => (
                          <a
                            key={option.label}
                            href={canCreateUpiIntent ? option.href : undefined}
                            aria-label={option.label}
                            aria-disabled={!canCreateUpiIntent || isHoldExpired || isConfirmed}
                            onClick={(event) => {
                              if (!canCreateUpiIntent || isHoldExpired || isConfirmed) {
                                event.preventDefault();
                                return;
                              }
                              setMessage('Complete payment in your UPI app, then return here and submit the UTR. App launch does not confirm payment.');
                            }}
                            className={`flex min-w-0 items-center gap-2 rounded-xl border border-[#ebdcd0] bg-white p-2 text-left transition ${
                              !canCreateUpiIntent || isHoldExpired || isConfirmed
                                ? 'cursor-not-allowed opacity-50'
                                : 'hover:border-[#94551a] hover:bg-[#fffaf5] active:scale-[0.98]'
                            }`}
                          >
                            <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${option.iconClass}`}>
                              {option.icon}
                            </span>
                            <span className="min-w-0 truncate text-xs font-bold text-slate-800">{option.label}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-amber-800" role="status">
                        UPI app payments are unavailable because the business UPI ID is not configured.
                      </p>
                    )}
                    <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                      Your payment remains pending until an admin verifies it. If an app does not open, choose Other UPI Apps.
                    </p>
                  </section>

                  {/* Amount Callout */}
                  <div className="rounded-2xl bg-gradient-to-r from-[#94551a] to-[#784312] p-4 text-white shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200/90">
                        Payment Amount
                      </p>
                      <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight mt-0.5">
                        {paymentAmountInput ? `₹${Number(paymentAmountInput).toLocaleString('en-IN')}` : 'Enter amount below'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                        {isBookingConfirmed ? 'Booking Confirmed' : `Advance ₹${advanceAmount}`}
                      </span>
                      <p className="text-[10px] text-amber-100/80 mt-1">
                        Remaining balance: ₹{remainingBalance.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details Card */}
                  <div className="rounded-2xl border border-[#ebdcd0] bg-[#fdfaf7] p-3.5 space-y-2 text-xs">
                    {statusData?.isBulkBooking || booking?.isBulkBooking ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 flex items-center gap-1.5 font-bold text-purple-900">
                            <Building className="h-3.5 w-3.5 text-purple-700" /> Bulk Group Booking
                          </span>
                          <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded text-[11px]">
                            {statusData?.bulkBookingId || booking?.bulkBookingId || 'Bulk Booking'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Included Rooms</span>
                          <span className="font-bold text-slate-800">
                            {statusData?.bulkEntries?.length || booking?.bulkCount || booking?.bookings?.length || 1} Rooms / Slots
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Building className="h-3.5 w-3.5 text-[#8c5211]" /> Venue & Room
                          </span>
                          <span className="font-bold text-slate-900 truncate max-w-[210px]">
                            {theaterName} · {roomName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#8c5211]" /> Date & Slot
                          </span>
                          <span className="font-bold text-slate-900">
                            {bookingDate} | {timeSlot}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-[#ebdcd0]/70">
                      <span className="text-slate-500">Booking Reference</span>
                      <button
                        type="button"
                        onClick={handleCopyRef}
                        className="font-mono font-bold text-[#8c5211] hover:text-[#a9651c] flex items-center gap-1 transition-colors text-xs"
                        title="Click to copy reference"
                      >
                        {statusData?.bulkBookingId || booking?.bulkBookingId || bookingRef}
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Customer Payment Submission */}
                  <form onSubmit={handleSubmitUpi} className="rounded-2xl border border-[#ebdcd0] bg-white p-3.5 shadow-xs space-y-3">
                    <div className="space-y-1.5">
                      <label htmlFor="paymentAmount" className="text-xs font-bold text-slate-800">
                        Enter Amount You Want to Pay <span className="text-amber-700">*</span>
                      </label>
                      <div className="flex items-center rounded-xl border border-[#ebdcd0] bg-[#fdfcf9] focus-within:border-[#94551a] focus-within:ring-1 focus-within:ring-[#94551a]/20">
                        <span className="px-3 text-sm font-bold text-slate-500">₹</span>
                        <input
                          id="paymentAmount"
                          type="number"
                          min="1"
                          max={remainingBalance}
                          step="0.01"
                          inputMode="decimal"
                          value={paymentAmountInput}
                          onChange={(e) => setPaymentAmountInput(e.target.value)}
                          placeholder="Enter payment amount"
                          disabled={isConfirmed || isHoldExpired || remainingBalance <= 0}
                          className="h-10 min-w-0 flex-1 rounded-r-xl bg-transparent pr-3 text-sm font-semibold text-slate-900 outline-none disabled:text-slate-400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 sm:grid-cols-4">
                        <span>Total: ₹{totalBookingAmount.toLocaleString('en-IN')}</span>
                        <span>Verified paid: ₹{verifiedPaidAmount.toLocaleString('en-IN')}</span>
                        <span>Pending review: ₹{pendingVerificationAmount.toLocaleString('en-IN')}</span>
                        <span>Remaining: ₹{remainingBalance.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Amount must be at least ₹1 and no more than the remaining balance. Pending claims do not reduce the balance until verified.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <label htmlFor="upiRef" className="text-xs font-bold text-slate-800">
                        UPI Reference / UTR Number <span className="text-amber-700">*</span>
                      </label>
                      <span className="text-[10px] font-medium text-slate-500">Found in your UPI app receipt</span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        id="upiRef"
                        type="text"
                        value={upiRefInput}
                        onChange={(e) => setUpiRefInput(e.target.value)}
                        placeholder={isHoldExpired ? 'Hold window expired' : 'Enter transaction reference / UTR'}
                        disabled={isConfirmed || isHoldExpired}
                        className="h-10 w-full min-w-0 px-3 text-xs rounded-xl border border-[#ebdcd0] bg-[#fdfcf9] font-mono text-slate-900 outline-none focus:border-[#94551a] focus:ring-1 focus:ring-[#94551a]/20 disabled:bg-slate-100 disabled:text-slate-400 transition sm:flex-1"
                      />
                      <button
                        type="submit"
                        disabled={submittingRef || isConfirmed || isHoldExpired || !upiRefInput.trim() || !paymentAmountInput}
                        className="h-10 w-full justify-center px-4 rounded-xl bg-[#94551a] hover:bg-[#7e4714] active:scale-[0.98] text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs sm:w-auto sm:shrink-0"
                      >
                        {submittingRef ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        <span>Submit Payment</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight">
                      Enter the reference from your UPI app receipt. Each reference can only be submitted once.
                    </p>
                  </form>

                  {latestSubmittedPayment && (
                    <div className="md:hidden rounded-2xl border border-indigo-200 bg-indigo-50 p-3 text-xs" role="status">
                      <p className="font-bold text-indigo-900">Payment details submitted — Pending Verification</p>
                      <div className="mt-2 flex justify-between gap-3 text-indigo-900">
                        <span>Advance amount paid</span>
                        <span className="font-bold">₹{Number(latestSubmittedPayment.paymentAmount || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <p className="mt-1 break-all text-indigo-800">
                        UTR / Reference: <span className="font-mono font-semibold">{latestSubmittedPayment.transactionReference}</span>
                      </p>
                    </div>
                  )}

                  {/* Payment Status Bar */}
                  <div className="rounded-2xl border border-[#ebdcd0] bg-[#fbf6f0] p-3 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
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
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {isConfirmed
                            ? 'Payment Fully Verified'
                            : isSubmitted
                            ? 'Pending Admin Verification'
                            : isRejected
                            ? 'Payment Failed / Rejected'
                            : isBookingConfirmed
                              ? 'Booking Confirmed'
                              : 'Awaiting Payment'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {isConfirmed
                            ? 'Your booking balance is paid in full.'
                            : isSubmitted
                            ? `₹${Number(latestSubmittedPayment?.paymentAmount || pendingVerificationAmount).toLocaleString('en-IN')} submitted; pending claims are not counted as paid.`
                            : isRejected
                            ? (latestSubmittedPayment?.rejectionReason || statusData?.rejectedReason || 'Please verify your transaction reference number and try again.')
                            : isBookingConfirmed
                              ? `Your required advance is verified. Remaining balance: ₹${remainingBalance.toLocaleString('en-IN')}.`
                              : 'Scan the static QR, pay your chosen amount, then submit the amount and UTR for admin verification.'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleManualCheck}
                      disabled={isVerifying}
                      className="text-xs font-bold text-[#8c5211] hover:text-[#94551a] flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ebdcd0] bg-white hover:bg-slate-50 transition shadow-2xs disabled:opacity-50 shrink-0 ml-2"
                    >
                      <RefreshCw className={`h-3 w-3 ${isVerifying ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Feedback Alerts */}
                  {message && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-start gap-2 shadow-2xs">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                      <span>{message}</span>
                    </div>
                  )}

                  {statusWarning && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 flex items-start gap-2 shadow-2xs" role="status">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-700" />
                      <span>{statusWarning}</span>
                    </div>
                  )}

                  {whatsAppUrl && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-900">
                          WhatsApp Notification Chat:
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          Click below if popup was blocked:
                        </span>
                      </div>
                      <div>
                        <a
                          href={whatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-xs transition w-full"
                        >
                          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                          </svg>
                          <span>Send WhatsApp Notification (+91 81478 97771)</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 flex items-start gap-2 shadow-2xs">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Clean Footer Bar */}
          <div className="px-5 sm:px-7 py-3 border-t border-[#f2e7de] bg-[#fdfaf6] flex items-center justify-between shrink-0">
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Slot is held while payment verification is underway.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs ml-auto"
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
