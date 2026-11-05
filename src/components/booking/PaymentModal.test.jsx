import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { checkStatus } = vi.hoisted(() => ({ checkStatus: vi.fn() }));

vi.mock('../../services/paymentService', () => ({
  paymentService: { checkStatus, submitUpiPayment: vi.fn() },
}));

import { PaymentModal } from './PaymentModal';

describe('PaymentModal', () => {
  it('creates a configured UPI intent for the selected amount and retains the static QR', async () => {
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
          pricing: { total: 2597 },
          payment: { status: 'pending' },
        }}
        upiId="configured@upi"
        theaterName="Rio Party House"
      />
    );

    const link = await screen.findByRole('link', { name: /pay using upi app/i });
    await waitFor(() => expect(link.getAttribute('href')).toBeTruthy());
    const intent = new URL(link.getAttribute('href'));

    expect(intent.protocol).toBe('upi:');
    expect(intent.searchParams.get('pa')).toBe('configured@upi');
    expect(intent.searchParams.get('pn')).toBe('Rio Party House');
    expect(intent.searchParams.get('am')).toBe('750.00');
    expect(intent.searchParams.get('cu')).toBe('INR');
    expect(screen.getByAltText('Rio Party House UPI QR Code')).toBeTruthy();
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
        upiId="configured@upi"
      />
    );

    expect(await screen.findByText(/temporary connection issue/i)).toBeTruthy();
  });

  it('does not open or poll payment status without a created booking ID', () => {
    const { container } = render(<PaymentModal isOpen booking={null} />);

    expect(container.firstChild).toBeNull();
    expect(checkStatus).not.toHaveBeenCalled();
  });
});