import { render, screen } from '@testing-library/react';
import type { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithoutRef } from 'react';
import Navbar from '../components/Navbar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, ...props }: LinkProps & ComponentPropsWithoutRef<'a'>) => (
    <a {...props}>{children}</a>
  );
});

const NAV_LINKS = [
  { label: 'Quizzing Engine', path: '/' },
  {
    label: 'Live Classes',
    path: '/live',
  },
];

describe('Navbar', () => {
  it('should render the logo with a link to the homepage', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Navbar />);

    const logoImage = screen.getByAltText('Avanti fellows logo');
    const link = screen.getByTitle('Avanti Fellows');
    expect(link).toHaveAttribute('href', '/');
    expect(logoImage).toBeInTheDocument();
  });

  it('should render the header text correctly', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Navbar />);

    const sessionText = screen.getByText(/ESSION/i);
    const managerText = screen.getByText(/ANAGER/i);
    expect(sessionText).toBeInTheDocument();
    expect(managerText).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<Navbar />);

    NAV_LINKS.forEach((link) => {
      const navLink = screen.getByText(link.label);
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute('href', link.path);
    });
  });

  it('should highlight the current page link', () => {
    (usePathname as jest.Mock).mockReturnValue('/live');

    render(<Navbar />);

    NAV_LINKS.forEach((link) => {
      const navLink = screen.getByText(link.label);
      if (link.path === '/live') {
        expect(navLink).toHaveClass('bg-accent');
        expect(navLink).toHaveClass('text-accent-foreground');
      } else {
        expect(navLink).not.toHaveClass('bg-accent');
        expect(navLink).not.toHaveClass('text-accent-foreground');
      }
    });
  });
});
