import { describe, expect, it } from 'vitest';
import { formatReviewDate } from '../utils/getDateFormat';

describe('formatReviewDate', () => {
    it.each([
        ['2026-07-12T08:30:00Z', '12.07.2026'],
        ['12.07.2026 11:30', '12.07.2026'],
        ['12.07.2026', '12.07.2026'],
    ])('formats %s deterministically', (input, expected) => {
        expect(formatReviewDate(input)?.text).toBe(expected);
    });

    it.each([null, undefined, '', 'not-a-date', '31.02.2026 10:00', '12.07.2026 25:00'])('hides invalid value %s', (input) => {
        expect(formatReviewDate(input)).toBeNull();
    });

    it('keeps a machine-readable legacy datetime', () => {
        expect(formatReviewDate('12.07.2026 11:30')?.datetime).toBe('2026-07-12T11:30:00+03:00');
    });
});
