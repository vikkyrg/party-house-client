import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { checkStatus } = vi.hoisted(() => ({ checkStatus: vi.fn() }));

vi.mock('../../services/paymentService', () => ({
  paymentService: { checkStatus, submitUpiPayment: vi.fn() },
}));

import { PaymentModal } from './PaymentModal';

describe('PaymentModal', () => {
  it('does not open or poll payment status without a created booking ID', () => {
    const { container } = render(<PaymentModal isOpen booking={null} />);

    expect(container.firstChild).toBeNull();
    expect(checkStatus).not.toHaveBeenCalled();
  });
});