import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.get('/api/routes', () => {
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