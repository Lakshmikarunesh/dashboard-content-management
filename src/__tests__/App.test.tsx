import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the dashboard', () => {
    render(<App />);
    expect(screen.getByText('ContentHub')).toBeInTheDocument();
  });

  it('displays content cards', () => {
    render(<App />);
    expect(screen.getByText('Personalized Feed')).toBeInTheDocument();
  });
});