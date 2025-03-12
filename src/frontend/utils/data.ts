
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

// Function to fetch routes from the server API
const fetchRoutesFromAPI = async (): Promise<BusRoute[]> => {
  try {
    const response = await fetch('/api/routes');
    if (!response.ok) {
      throw new Error('Failed to fetch routes from API');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching routes from API:', error);
    // Fall back to localStorage if API fails
    return loadRoutesFromLocalStorage();
  }
};

// Load routes from localStorage
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

// Global storage for routes
let mockRoutes: BusRoute[] = [];

// Initialize routes from API if possible, otherwise from localStorage
const initializeRoutes = async () => {
  try {
    mockRoutes = await fetchRoutesFromAPI();
  } catch (error) {
    console.error('Failed to initialize routes from API:', error);
    mockRoutes = loadRoutesFromLocalStorage();
  }
  // Also save to localStorage as a backup
  saveRoutesToLocalStorage();
  return mockRoutes;
};

// Save routes to localStorage with proper error handling
const saveRoutesToLocalStorage = () => {
  try {
    localStorage.setItem('tunisbus_routes', JSON.stringify(mockRoutes));
    console.log('Routes saved successfully to localStorage:', mockRoutes.length, 'routes');
  } catch (error) {
    console.error('Error saving routes to localStorage:', error);
  }
};

// Add a new route
export const addRoute = async (route: Omit<BusRoute, 'id'>): Promise<string> => {
  try {
    // Try to add the route to the database first
    const response = await fetch('/api/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(route),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add route to database');
    }
    
    const data = await response.json();
    
    // Update local state after successful API call
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
    
    return data.id;
  } catch (error) {
    console.error('Error adding route to database:', error);
    
    // Fallback to local storage in case of API failure
    const id = Date.now().toString();
    const newRoute = { id, ...route };
    mockRoutes = [...mockRoutes, newRoute];
    saveRoutesToLocalStorage();
    
    return id;
  }
};

// Update an existing route
export const updateRoute = async (id: string, routeData: Omit<BusRoute, 'id'>) => {
  try {
    // Try to update the route in the database first
    const response = await fetch(`/api/routes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update route in database');
    }
    
    // Update local state after successful API call
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
  } catch (error) {
    console.error('Error updating route in database:', error);
    
    // Fallback to local storage in case of API failure
    mockRoutes = mockRoutes.map(route => 
      route.id === id ? { ...route, ...routeData } : route
    );
    saveRoutesToLocalStorage();
  }
};

// Delete a route
export const deleteRoute = async (id: string) => {
  try {
    // Try to delete the route from the database first
    const response = await fetch(`/api/routes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete route from database');
    }
    
    // Update local state after successful API call
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
  } catch (error) {
    console.error('Error deleting route from database:', error);
    
    // Fallback to local storage in case of API failure
    mockRoutes = mockRoutes.filter(route => route.id !== id);
    saveRoutesToLocalStorage();
  }
};

// Get all routes
export const getRoutes = async (): Promise<BusRoute[]> => {
  try {
    // Try to get the latest routes from the database
    mockRoutes = await fetchRoutesFromAPI();
    saveRoutesToLocalStorage();
  } catch (error) {
    console.error('Error getting routes from database:', error);
    
    // If API fails, use the local routes
    if (mockRoutes.length === 0) {
      mockRoutes = loadRoutesFromLocalStorage();
    }
  }
  
  return [...mockRoutes];
};

// Initialize routes when this module is imported
initializeRoutes().catch(error => {
  console.error('Failed to initialize routes:', error);
  // Fallback to localStorage
  mockRoutes = loadRoutesFromLocalStorage();
});

// Synchronous version of getRoutes for components that can't use async
export const getRoutesSync = (): BusRoute[] => {
  if (mockRoutes.length === 0) {
    mockRoutes = loadRoutesFromLocalStorage();
  }
  return [...mockRoutes];
};
