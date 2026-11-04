/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import QRCode from 'qrcode';
import { paymentService } from '../../services/paymentService';
import PaymentModal from './PaymentModal';

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(async () => 'data:image/png;base64,encoded-qr'),
  },
}));

vi.mock('../../services/paymentService', () => ({
  paymentService: {
    checkStatus: vi.fn(),
    submitUpiPayment: vi.fn(),
  },
}));

describe('PaymentModal dynamic payment amount', () => {
  const booking = {
    _id: 'booking-db-id',
    bookingId: 'CS-20261104-001',
    status: 'pending_payment',
    pricing: { total: 2147 },
    payment: { status: 'pending' },
    holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    theaterName: 'Rio Party House',
    roomName: 'Sigma',
    date: '2026-11-06',
    timeSlot: '10:00 AM - 11:00 AM',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    paymentService.checkStatus.mockResolvedValue({
      success: true,
      data: {
        status: 'pending_payment',
        paymentStatus: 'pending',
        paymentRecords: [],
        paymentSummary: {
          totalBookingAmount: 2147,
          verifiedAmountPaid: 0,
          pendingVerificationAmount: 0,
          remainingBalance: 2147,
          paymentStatus: 'unpaid',
        },
      },
    });
    paymentService.submitUpiPayment.mockResolvedValue({
      success: true,
      message: 'Payment submitted successfully.',
      data: {
        status: 'pending_verification',
        paymentStatus: 'pending_verification',
        paymentRecords: [{
          _id: 'payment-record-id',
          paymentAmount: 750,
          transactionReference: 'UTR123456789',
          paymentStatus: 'pending_verification',
        }],
        paymentSummary: {
          totalBookingAmount: 2147,
          verifiedAmountPaid: 0,
          pendingVerificationAmount: 750,
          remainingBalance: 2147,
          paymentStatus: 'pending_verification',
        },
      },
    });
  });

  it('lets the customer edit the amount, updates the UPI QR, and submits the exact amount with its UTR', async () => {
    render(<PaymentModal isOpen booking={booking} onClose={vi.fn()} />);

    const amountInput = await screen.findByLabelText('Enter Amount You Want to Pay');
    await waitFor(() => expect(amountInput).toHaveValue(2147));
    expect(screen.getByText('Total Booking Amount')).toBeInTheDocument();
    expect(screen.getAllByText('₹2,147').length).toBeGreaterThan(0);

    fireEvent.change(amountInput, { target: { value: '750' } });
    expect(screen.getAllByText('Scan to Pay')[0].nextElementSibling).toHaveTextContent('₹750');
    await waitFor(() => {
      expect(QRCode.toDataURL).toHaveBeenLastCalledWith(
        expect.stringContaining('am=750.00'),
        expect.any(Object)
      );
    });

    fireEvent.change(screen.getByLabelText(/UPI Reference \/ UTR Number/), {
      target: { value: 'UTR123456789' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Payment' }));

    await waitFor(() => {
      expect(paymentService.submitUpiPayment).toHaveBeenCalledWith({
        bookingId: 'booking-db-id',
        paymentAmount: 750,
        transactionReference: 'UTR123456789',
        upiTransactionId: 'UTR123456789',
      });
    });
    expect(await screen.findByText('₹750 submitted — Pending Verification')).toBeInTheDocument();
  });
});
