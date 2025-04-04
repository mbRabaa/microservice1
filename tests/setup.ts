// tests/setup.ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { beforeAll, afterAll, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react' // Import manquant ajouté ici
import '@testing-library/jest-dom/vitest' // Pour Vitest

// 1. Configuration des mocks globaux
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// Mock pour les APIs navigateurs communes
Object.defineProperties(window, {
  matchMedia: {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  },
  ResizeObserver: {
    writable: true,
    value: MockResizeObserver,
  },
  scrollTo: {
    value: vi.fn(),
  },
})

// 2. Configuration de MSW pour les mocks API
const apiHandlers = [
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
    ])
  }),
  http.all('*', ({ request }) => {
    console.warn(`Requête non mockée: ${request.method} ${request.url}`)
    return HttpResponse.json({ error: 'Requête non mockée' }, { status: 404 })
  }),
]

const server = setupServer(...apiHandlers)

// 3. Configuration des hooks Vitest
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
  cleanup() // Fonction maintenant disponible
})

afterAll(() => {
  server.close()
})

// 4. Export des utilitaires pour les tests
export { server, HttpResponse, http }