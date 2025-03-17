import { test, expect, vi, beforeEach, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import React from 'react';
import '@testing-library/jest-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import { server } from './setup';

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('user', 'Rabaa');
});

// Start the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Vérifie que le texte s'affiche", async () => {
  render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );

  // Debug the rendered output
  screen.debug();

  // Verify localStorage
  expect(localStorage.getItem('user')).toBe('Rabaa');

  // Check for the text
  const textElement = await screen.findByText(/Bonjour Rabaa/i);
  expect(textElement).toBeInTheDocument();
});
