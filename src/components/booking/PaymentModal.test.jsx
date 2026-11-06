import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { checkStatus, submitUpiPayment, getPaymentSettings } = vi.hoisted(() => ({
  checkStatus: vi.fn(),
  submitUpiPayment: vi.fn(),
  getPaymentSettings: vi.fn(),
}));

vi.mock('../../services/paymentService', () => ({
  paymentService: { checkStatus, submitUpiPayment },
}));

vi.mock('../../services/settingService', () => ({
  settingService: { getPaymentSettings },
}));

import { PaymentModal } from './PaymentModal';

describe('PaymentModal', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('provides booking-specific mobile UPI intents while retaining the static desktop QR', async () => {
    checkStatus.mockResolvedValue({
      success: true,
      data: {
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        paymentSummary: {
          totalBookingAmount: 2597,
          verifiedAmountPaid: 0,
          pendingVerificationAmount: 0,
          remainingBalance: 2597,
        },
      },
    });

    render(
      <PaymentModal
        isOpen
        booking={{
          _id: '507f1f77bcf86cd799439011',
          bookingId: 'CS-TEST-123',
          status: 'pending_payment',
          pricing: { total: 2597, advanceAmount: 620 },
          payment: { status: 'pending' },
        }}
        upiId="shailajagovindraju-1@okhdfcbank"
        theaterName="Rio Party House"
      />
    );

    const link = await screen.findByRole('link', { name: /other upi apps/i });
    await waitFor(() => expect(link.getAttribute('href')).toBeTruthy());
    const intent = new URL(link.getAttribute('href'));

    expect(intent.protocol).toBe('upi:');
    expect(intent.searchParams.get('pa')).toBe('shailajagovindraju-1@okhdfcbank');
    expect(intent.searchParams.get('pn')).toBe('Rio Party House');
    expect(intent.searchParams.get('am')).toBe('620.00');
    expect(intent.searchParams.get('cu')).toBe('INR');
    expect(intent.searchParams.get('tn')).toBe('Booking CS-TEST-123');

    const googlePayLink = screen.getByRole('link', { name: /google pay/i });
    const phonePeLink = screen.getByRole('link', { name: /phonepe/i });
    const paytmLink = screen.getByRole('link', { name: /^paytm$/i });
    expect(googlePayLink.getAttribute('href')).toMatch(/^tez:\/\/upi\/pay\?/);
    expect(phonePeLink.getAttribute('href')).toMatch(/^phonepe:\/\/pay\?/);
    expect(paytmLink.getAttribute('href')).toMatch(/^paytmmp:\/\/pay\?/);

    for (const appLink of [googlePayLink, phonePeLink, paytmLink]) {
      const appIntent = new URL(appLink.getAttribute('href'));
      expect(appIntent.searchParams.get('pa')).toBe('shailajagovindraju-1@okhdfcbank');
      expect(appIntent.searchParams.get('am')).toBe('620.00');
      expect(appIntent.searchParams.get('cu')).toBe('INR');
      expect(appIntent.searchParams.get('tn')).toBe('Booking CS-TEST-123');
    }

    expect(screen.getByAltText('Rio Party House UPI QR Code')).toBeTruthy();
    expect(screen.getByAltText('Rio Party House UPI QR Code').closest('.hidden')?.classList.contains('md:flex')).toBe(true);
  });

  it('shows a temporary status warning when the status API is unavailable', async () => {
    checkStatus.mockRejectedValueOnce(new Error('network unavailable'));

    render(
      <PaymentModal
        isOpen
        booking={{
          _id: '507f1f77bcf86cd799439011',
          bookingId: 'CS-TEST-123',
          status: 'pending_payment',
          pricing: { total: 2597 },
          payment: { status: 'pending' },
        }}
        upiId="shailajagovindraju-1@okhdfcbank"
      />
    );

    expect(await screen.findByText(/temporary connection issue/i)).toBeTruthy();
  });

  it('uses the public payment configuration when no UPI ID prop is provided', async () => {
    getPaymentSettings.mockResolvedValue({
      data: { upiId: 'shailajagovindraju-1@okhdfcbank' },
    });
    checkStatus.mockResolvedValue({
      success: true,
      data: {
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        paymentSummary: {
          totalBookingAmount: 2597,
          verifiedAmountPaid: 0,
          pendingVerificationAmount: 0,
          remainingBalance: 2597,
        },
      },
    });

    render(
      <PaymentModal
        isOpen
        booking={{
          _id: '507f1f77bcf86cd799439011',
          bookingId: 'CS-TEST-123',
          status: 'pending_payment',
          pricing: { total: 2597, advanceAmount: 620 },
          payment: { status: 'pending' },
        }}
        theaterName="Rio Party House"
      />
    );

    const link = await screen.findByRole('link', { name: /other upi apps/i });
    const intent = new URL(link.getAttribute('href'));
    expect(getPaymentSettings).toHaveBeenCalledTimes(1);
    expect(intent.searchParams.get('pa')).toBe('shailajagovindraju-1@okhdfcbank');
    expect(intent.searchParams.get('am')).toBe('620.00');
    expect(intent.searchParams.get('pn')).toBe('Rio Party House');
    expect(intent.searchParams.get('cu')).toBe('INR');
    expect(intent.searchParams.get('tn')).toBe('Booking CS-TEST-123');
  });

  it('uses the configured mobile UPI ID when payment settings cannot be loaded', async () => {
    getPaymentSettings.mockRejectedValue(new Error('settings unavailable'));
    checkStatus.mockResolvedValue({
      success: true,
      data: {
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        paymentSummary: {
          totalBookingAmount: 2597,
          verifiedAmountPaid: 0,
          pendingVerificationAmount: 0,
          remainingBalance: 2597,
        },
      },
    });

    render(
      <PaymentModal
        isOpen
        booking={{
          _id: '507f1f77bcf86cd799439011',
          bookingId: 'CS-TEST-123',
          status: 'pending_payment',
          pricing: { total: 2597, advanceAmount: 620 },
          payment: { status: 'pending' },
        }}
        theaterName="Rio Party House"
      />
    );

    const link = await screen.findByRole('link', { name: /other upi apps/i });
    const intent = new URL(link.getAttribute('href'));
    expect(intent.searchParams.get('pa')).toBe('shailajagovindraju-1@okhdfcbank');
    expect(intent.searchParams.get('am')).toBe('620.00');
    expect(intent.searchParams.get('cu')).toBe('INR');
  });

  it('submits the entered UTR and opens WhatsApp with pending payment details', async () => {
    checkStatus.mockResolvedValue({
      success: true,
      data: {
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        paymentSummary: {
          totalBookingAmount: 2597,
          verifiedAmountPaid: 0,
          pendingVerificationAmount: 0,
          remainingBalance: 2597,
        },
      },
    });
    const paymentRecord = {
      paymentAmount: 620,
      transactionReference: '123456789012',
      paymentStatus: 'pending_verification',
    };
    submitUpiPayment.mockResolvedValue({
      success: true,
      data: {
        status: 'pending_verification',
        paymentStatus: 'pending_verification',
        paymentRecords: [paymentRecord],
        paymentSummary: {
          totalBookingAmount: 2597,
          verifiedAmountPaid: 0,
          pendingVerificationAmount: 620,
          remainingBalance: 2597,
        },
      },
    });
    const openWindow = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <PaymentModal
        isOpen
        booking={{
          _id: '507f1f77bcf86cd799439011',
          bookingId: 'CS-TEST-123',
          status: 'pending_payment',
          date: '2026-11-05T00:00:00.000Z',
          timeSlot: '7:00 PM',
          pricing: { total: 2597, advanceAmount: 620 },
          customerDetails: { name: 'Test Customer', phone: '9999999999' },
          payment: { status: 'pending' },
        }}
        upiId="shailajagovindraju-1@okhdfcbank"
        theaterName="Rio Party House"
        roomName="Private Room"
      />
    );

    fireEvent.change(screen.getByLabelText(/upi reference \/ utr number/i), {
      target: { value: '123456789012' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit payment/i }));

    await waitFor(() => {
      expect(submitUpiPayment).toHaveBeenCalledWith({
        bookingId: '507f1f77bcf86cd799439011',
        paymentAmount: 620,
        transactionReference: '123456789012',
      });
    });
    expect(await screen.findByText(/payment details submitted — pending verification/i)).toBeTruthy();

    const whatsappUrl = new URL(openWindow.mock.calls[0][0]);
    const whatsappMessage = whatsappUrl.searchParams.get('text');
    expect(whatsappUrl.pathname).toBe('/918147897771');
    expect(whatsappMessage).toContain('Customer Name: Test Customer');
    expect(whatsappMessage).toContain('Booking ID: CS-TEST-123');
    expect(whatsappMessage).toContain('Advance Amount Paid (pending verification): ₹620');
    expect(whatsappMessage).toContain('UPI Reference / UTR: 123456789012');
    expect(whatsappMessage).toContain('Remaining Balance (after verification): ₹1,977');
  });

  it('does not open or poll payment status without a created booking ID', () => {
    const { container } = render(<PaymentModal isOpen booking={null} />);

    expect(container.firstChild).toBeNull();
    expect(checkStatus).not.toHaveBeenCalled();
  });
});