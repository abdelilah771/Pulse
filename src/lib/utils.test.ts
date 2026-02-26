import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('handles conditional classes', () => {
      expect(cn('bg-red-500', true && 'text-white', false && 'hidden')).toBe('bg-red-500 text-white');
    });

    it('overrides conflicting tailwind classes', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });
  });

  describe('extractTitle', () => {
    it('extracts the first line of content', () => {
      expect(extractTitle('Hello World\nThis is a note')).toBe('Hello World');
    });

    it('limits title to 30 characters', () => {
      const longTitle = 'This is a very long title that exceeds thirty characters';
      expect(extractTitle(longTitle).length).toBe(30);
      expect(extractTitle(longTitle)).toBe('This is a very long title that');
    });

    it('returns empty string for null or empty content', () => {
      expect(extractTitle('')).toBe('');
      expect(extractTitle(null as any)).toBe('');
    });
  });
});
