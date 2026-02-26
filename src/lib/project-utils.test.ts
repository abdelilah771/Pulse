import { describe, it, expect } from 'vitest';
import { getProjectColorStyle, getProjectGradient, getProjectImage, calculateStats, COLOR_STYLES, GRADIENT_MAP, IMAGE_MAP } from './project-utils';

describe('project-utils', () => {
  describe('getProjectColorStyle', () => {
    it('returns the correct style for a valid color', () => {
      expect(getProjectColorStyle('emerald')).toBe(COLOR_STYLES.emerald);
      expect(getProjectColorStyle('blue')).toBe(COLOR_STYLES.blue);
    });

    it('returns the default emerald style for an invalid color', () => {
      expect(getProjectColorStyle('non-existent')).toBe(COLOR_STYLES.emerald);
    });
  });

  describe('getProjectGradient', () => {
    it('returns the correct gradient for a valid color', () => {
      expect(getProjectGradient('purple')).toBe(GRADIENT_MAP.purple);
      expect(getProjectGradient('orange')).toBe(GRADIENT_MAP.orange);
    });

    it('returns the default blue gradient for an invalid color', () => {
      expect(getProjectGradient('non-existent')).toBe(GRADIENT_MAP.blue);
    });
  });

  describe('getProjectImage', () => {
    it('returns the correct image for a valid color', () => {
      expect(getProjectImage('rose')).toBe(IMAGE_MAP.rose);
    });

    it('returns the default blue image for an invalid color', () => {
      expect(getProjectImage('non-existent')).toBe(IMAGE_MAP.blue);
    });
  });

  describe('calculateStats', () => {
    it('calculates stats correctly for empty list', () => {
      expect(calculateStats([])).toEqual({ totalTasks: 0, completedTasks: 0, inProgress: 0 });
    });

    it('calculates stats correctly for a mixed list', () => {
      const tasks = [{ done: true }, { done: false }, { done: true }];
      expect(calculateStats(tasks)).toEqual({ totalTasks: 3, completedTasks: 2, inProgress: 1 });
    });
  });
});
