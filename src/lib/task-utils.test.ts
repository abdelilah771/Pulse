import { describe, it, expect } from 'vitest';
import { getInitials, getPriority, getAccentColor, priorityConfig, accentColors } from './task-utils';

describe('task-utils', () => {
  describe('getInitials', () => {
    it('returns initials for a full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('returns initials for a single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('returns ? for null or empty name', () => {
      expect(getInitials(null)).toBe('?');
      expect(getInitials('')).toBe('?');
    });

    it('returns up to 2 characters', () => {
      expect(getInitials('John Jacob Jingleheimer Schmidt')).toBe('JJ');
    });
  });

  describe('getPriority', () => {
    it('returns correct config for valid priority', () => {
      expect(getPriority('high')).toEqual(priorityConfig.high);
    });

    it('returns medium config for invalid priority', () => {
      expect(getPriority('invalid')).toEqual(priorityConfig.medium);
    });
  });

  describe('getAccentColor', () => {
    it('returns correct color for valid priority', () => {
      expect(getAccentColor('high')).toBe(accentColors.high);
    });

    it('returns medium color for invalid priority', () => {
      expect(getAccentColor('invalid')).toBe(accentColors.medium);
    });
  });
});
