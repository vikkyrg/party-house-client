import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaymentProcessingPanel } from './PaymentProcessingPanel';

afterEach(() => {
  vi.useRealTimers();
});

describe('PaymentProcessingPanel', () => {
  it('does not open the payment modal after booking creation fails', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    render(
      <PaymentProcessingPanel
        isSubmitting={false}
        error="Booking creation failed"
        onComplete={onComplete}
      />
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('opens the payment modal after booking creation succeeds', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    render(
      <PaymentProcessingPanel
        isSubmitting={false}
        onComplete={onComplete}
      />
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
