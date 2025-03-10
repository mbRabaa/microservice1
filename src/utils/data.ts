
export interface Province {
  id: number;
  name: string;
  nameAr: string;
}

export interface BusRoute {
  id: string;
  departure: string;
  destination: string;
  date: string;
  time: string;
  price: number;
  duration: string;
  availableSeats: number;
}

export const tunisianProvinces: Province[] = [
  { id: 1, name: 'Tunis', nameAr: 'تونس' },
  { id: 2, name: 'Ariana', nameAr: 'أريانة' },
  { id: 3, name: 'Ben Arous', nameAr: 'بن عروس' },
  { id: 4, name: 'Manouba', nameAr: 'منوبة' },
  { id: 5, name: 'Nabeul', nameAr: 'نابل' },
  { id: 6, name: 'Zaghouan', nameAr: 'زغوان' },
  { id: 7, name: 'Bizerte', nameAr: 'بنزرت' },
  { id: 8, name: 'Béja', nameAr: 'باجة' },
  { id: 9, name: 'Jendouba', nameAr: 'جندوبة' },
  { id: 10, name: 'Kef', nameAr: 'الكاف' },
  { id: 11, name: 'Siliana', nameAr: 'سليانة' },
  { id: 12, name: 'Sousse', nameAr: 'سوسة' },
  { id: 13, name: 'Monastir', nameAr: 'المنستير' },
  { id: 14, name: 'Mahdia', nameAr: 'المهدية' },
  { id: 15, name: 'Sfax', nameAr: 'صفاقس' },
  { id: 16, name: 'Kairouan', nameAr: 'القيروان' },
  { id: 17, name: 'Kasserine', nameAr: 'القصرين' },
  { id: 18, name: 'Sidi Bouzid', nameAr: 'سيدي بوزيد' },
  { id: 19, name: 'Gabès', nameAr: 'قابس' },
  { id: 20, name: 'Medenine', nameAr: 'مدنين' },
  { id: 21, name: 'Tataouine', nameAr: 'تطاوين' },
  { id: 22, name: 'Gafsa', nameAr: 'قفصة' },
  { id: 23, name: 'Tozeur', nameAr: 'توزر' },
  { id: 24, name: 'Kebili', nameAr: 'قبلي' },
];

// Default routes data
const defaultRoutes: BusRoute[] = [
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
  {
    id: '2',
    departure: 'Tunis',
    destination: 'Sfax',
    date: '2023-06-15',
    time: '09:30',
    price: 25,
    duration: '4h 15min',
    availableSeats: 35,
  },
  {
    id: '3',
    departure: 'Sousse',
    destination: 'Monastir',
    date: '2023-06-15',
    time: '10:00',
    price: 5,
    duration: '45min',
    availableSeats: 45,
  },
  {
    id: '4',
    departure: 'Sfax',
    destination: 'Gabès',
    date: '2023-06-15',
    time: '11:15',
    price: 15,
    duration: '1h 45min',
    availableSeats: 38,
  },
  {
    id: '5',
    departure: 'Tunis',
    destination: 'Bizerte',
    date: '2023-06-16',
    time: '07:30',
    price: 10,
    duration: '1h 15min',
    availableSeats: 42,
  },
];

// Load routes from localStorage or use default ones
const loadRoutes = (): BusRoute[] => {
  const savedRoutes = localStorage.getItem('tunisbus_routes');
  if (savedRoutes) {
    try {
      return JSON.parse(savedRoutes);
    } catch (error) {
      console.error('Error parsing saved routes:', error);
      return [...defaultRoutes];
    }
  }
  return [...defaultRoutes];
};

// Initialize mockRoutes with loaded routes
let mockRoutes: BusRoute[] = loadRoutes();

// Save routes to localStorage
const saveRoutes = () => {
  localStorage.setItem('tunisbus_routes', JSON.stringify(mockRoutes));
};

export { mockRoutes };

export const addRoute = (route: Omit<BusRoute, 'id'>): string => {
  const id = Date.now().toString();
  const newRoute = { id, ...route };
  mockRoutes = [...mockRoutes, newRoute];
  saveRoutes();
  return id;
};

export const updateRoute = (id: string, routeData: Omit<BusRoute, 'id'>) => {
  mockRoutes = mockRoutes.map(route => 
    route.id === id ? { ...route, ...routeData } : route
  );
  saveRoutes();
};

export const deleteRoute = (id: string) => {
  mockRoutes = mockRoutes.filter(route => route.id !== id);
  saveRoutes();
};

export const getRoutes = (): BusRoute[] => {
  // Always reload from localStorage first in case changes were made in another component
  mockRoutes = loadRoutes();
  return [...mockRoutes];
};
