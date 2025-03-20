// src/frontend/utils/data.ts

// Interface pour représenter une province tunisienne
export interface Province {
  id: number;
  name: string;
  nameAr: string;
}

// Interface pour représenter une route de bus
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

// Liste des provinces tunisiennes
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

// Données par défaut pour les routes de bus
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

// Fonction pour récupérer les routes depuis l'API
const fetchRoutesFromAPI = async (): Promise<BusRoute[]> => {
  // En mode test, retourner les routes par défaut
  if (process.env.NODE_ENV === 'test') {
    return [...defaultRoutes];
  }

  try {
    const response = await fetch(`${process.env.VITE_API_URL}/routes`);
    if (!response.ok) {
      throw new Error('Failed to fetch routes from API');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching routes from API:', error);
    // Retourner les routes depuis le localStorage en cas d'échec
    return loadRoutesFromLocalStorage();
  }
};

// Fonction pour charger les routes depuis le localStorage
const loadRoutesFromLocalStorage = (): BusRoute[] => {
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

// Stockage global des routes
let mockRoutes: BusRoute[] = [];

// Initialiser les routes depuis l'API ou le localStorage
const initializeRoutes = async () => {
  try {
    mockRoutes = await fetchRoutesFromAPI();
  } catch (error) {
    console.error('Failed to initialize routes from API:', error);
    mockRoutes = loadRoutesFromLocalStorage();
  }
  // Sauvegarder dans le localStorage comme backup
  saveRoutesToLocalStorage();
  return mockRoutes;
};

// Sauvegarder les routes dans le localStorage
const saveRoutesToLocalStorage = () => {
  try {
    localStorage.setItem('tunisbus_routes', JSON.stringify(mockRoutes));
    console.log('Routes saved successfully to localStorage:', mockRoutes.length, 'routes');
  } catch (error) {
    console.error('Error saving routes to localStorage:', error);
  }
};

// Ajouter une nouvelle route
export const addRoute = async (route: Omit<BusRoute, 'id'>): Promise<string> => {
  // En mode test, simuler l'ajout d'une route
  if (process.env.NODE_ENV === 'test') {
    const id = Date.now().toString();
    const newRoute = { id, ...route };
    mockRoutes = [...mockRoutes, newRoute];
    saveRoutesToLocalStorage();
    return id;
  }

  try {
    const response = await fetch(`${process.env.VITE_API_URL}/routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(route),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add route to database');
    }
    
    const data = await response.json();
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
    return data.id;
  } catch (error) {
    console.error('Error adding route to database:', error);
    const id = Date.now().toString();
    const newRoute = { id, ...route };
    mockRoutes = [...mockRoutes, newRoute];
    saveRoutesToLocalStorage();
    return id;
  }
};

// Mettre à jour une route existante
export const updateRoute = async (id: string, routeData: Omit<BusRoute, 'id'>) => {
  // En mode test, simuler la mise à jour d'une route
  if (process.env.NODE_ENV === 'test') {
    mockRoutes = mockRoutes.map(route => 
      route.id === id ? { ...route, ...routeData } : route
    );
    saveRoutesToLocalStorage();
    return;
  }

  try {
    const response = await fetch(`${process.env.VITE_API_URL}/routes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update route in database');
    }
    
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
  } catch (error) {
    console.error('Error updating route in database:', error);
    mockRoutes = mockRoutes.map(route => 
      route.id === id ? { ...route, ...routeData } : route
    );
    saveRoutesToLocalStorage();
  }
};

// Supprimer une route
export const deleteRoute = async (id: string) => {
  // En mode test, simuler la suppression d'une route
  if (process.env.NODE_ENV === 'test') {
    mockRoutes = mockRoutes.filter(route => route.id !== id);
    saveRoutesToLocalStorage();
    return;
  }

  try {
    const response = await fetch(`${process.env.VITE_API_URL}/routes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete route from database');
    }
    
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
  } catch (error) {
    console.error('Error deleting route from database:', error);
    mockRoutes = mockRoutes.filter(route => route.id !== id);
    saveRoutesToLocalStorage();
  }
};

// Récupérer toutes les routes (version asynchrone)
export const getRoutes = async (): Promise<BusRoute[]> => {
  try {
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
    return [...mockRoutes];
  } catch (error) {
    console.error('Error getting routes from database:', error);
    if (mockRoutes.length === 0) {
      mockRoutes = loadRoutesFromLocalStorage();
    }
    return [...mockRoutes];
  }
};

// Initialiser les routes lors de l'importation du module
initializeRoutes().catch(error => {
  console.error('Failed to initialize routes:', error);
  mockRoutes = loadRoutesFromLocalStorage();
});

// Récupérer toutes les routes (version synchrone)
export const getRoutesSync = (): BusRoute[] => {
  if (mockRoutes.length === 0) {
    mockRoutes = loadRoutesFromLocalStorage();
  }
  return [...mockRoutes];
};