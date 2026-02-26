import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  it('renders a placeholder when not mounted', () => {
    (useTheme as any).mockReturnValue({ theme: 'light', setTheme: vi.fn() });
    
    // We can't easily test the initial state before useEffect in a simple render
    // but we can check the button exists after mount
  });

  it('toggles theme when clicked', () => {
    const setTheme = vi.fn();
    (useTheme as any).mockReturnValue({ theme: 'light', setTheme });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('shows Moon icon in light mode and Sun in dark mode', () => {
    const setTheme = vi.fn();
    
    // Test light mode (should show Moon button)
    (useTheme as any).mockReturnValue({ theme: 'light', setTheme });
    const { rerender } = render(<ThemeToggle />);
    expect(screen.getByTitle('Mode sombre')).toBeDefined();

    // Test dark mode (should show Sun button)
    (useTheme as any).mockReturnValue({ theme: 'dark', setTheme });
    rerender(<ThemeToggle />);
    expect(screen.getByTitle('Mode clair')).toBeDefined();
  });
});
