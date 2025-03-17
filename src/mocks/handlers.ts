// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Intercepte les requêtes GET vers /api/routes
  http.get('http://localhost:8080/api/routes', () => {
    return HttpResponse.json([
      { id: 1, name: 'Route 1' },
      { id: 2, name: 'Route 2' },
    ]);
  }),
];
