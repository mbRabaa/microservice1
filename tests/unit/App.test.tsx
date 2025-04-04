import React from 'react';
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../../src/App'
import { server } from '../setup';

beforeAll(() => {
  server.listen();
  console.log('Mock server started');
});

afterAll(() => {
  server.close();
  console.log('Mock server stopped');
});

afterEach(() => {
  server.resetHandlers();
});

describe('App', () => {
  it('renders correctly', async () => {
    render(<App />);

    const departure = await screen.findByText(/Nos Services/i);
    expect(departure).toBeInTheDocument();
  });
});