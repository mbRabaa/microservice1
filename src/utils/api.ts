const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchRoutesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/routes`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la requête API:', error);
    throw error;
  }
};

export { fetchRoutesFromAPI };