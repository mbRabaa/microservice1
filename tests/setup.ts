import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { vi } from 'vitest';

// Mock pour window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Déprécié
    removeListener: vi.fn(), // Déprécié
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock pour la requête API
const handlers = [
  http.get('http://localhost:5000/api/routes', () => {
    return HttpResponse.json([
      {
        id: '1',
        departure: 'Tunis',
        destination: 'Sousse',
        date: '2023-06-15',
        time: '08:00',
        price: 15,
        duration: '2h 30min',
        availableSeats: 40,
      },
    ]);
  }),
];

const server = setupServer(...handlers);

export { server };