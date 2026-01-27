import { describe, expect, it } from 'vitest';
import { formatDateForComparison, parseWorkoutDate } from './helpers';

describe('date helpers', () => {
  it('formatDateForComparison returns YYYY-MM-DD for Date', () => {
    const d = new Date('2026-01-26T00:00:00.000Z');
    expect(formatDateForComparison(d)).toBe('2026-01-26');
  });

  it('formatDateForComparison returns input for string', () => {
    expect(formatDateForComparison('2026-01-26')).toBe('2026-01-26');
  });

  it('parseWorkoutDate parses YYYY-MM-DD safely', () => {
    const d = parseWorkoutDate('2026-01-26');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(26);
  });
});

