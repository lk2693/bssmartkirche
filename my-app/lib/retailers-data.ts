import retailersData from '../data/retailers.json';

export interface Retailer {
  id: string;
  name: string;
  category: string;
  area: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  district: string;
  phone: string | null;
  website: string;
  opening_hours: string;
  source_url: string;
  address: string;
}

export interface RetailersData {
  meta: {
    generated_at: string;
    notes: string;
  };
  retailers: Retailer[];
}

// Import the data and provide type safety
const typedRetailersData: RetailersData = retailersData as RetailersData;

export const getAllRetailers = (): Retailer[] => {
  // Filter out Gastronomie category
  return typedRetailersData.retailers.filter(retailer => 
    retailer.category !== 'Gastronomie'
  );
};

export const getRetailersByCategory = (category: string): Retailer[] => {
  if (category === 'Alle') {
    return getAllRetailers();
  }
  return typedRetailersData.retailers.filter(retailer => 
    retailer.category === category
  );
};

export const getRetailersByArea = (area: string): Retailer[] => {
  return typedRetailersData.retailers.filter(retailer => 
    retailer.area === area
  );
};

export const searchRetailers = (query: string): Retailer[] => {
  const lowercaseQuery = query.toLowerCase();
  return typedRetailersData.retailers.filter(retailer =>
    retailer.category !== 'Gastronomie' && (
      retailer.name.toLowerCase().includes(lowercaseQuery) ||
      retailer.category.toLowerCase().includes(lowercaseQuery) ||
      retailer.area.toLowerCase().includes(lowercaseQuery) ||
      retailer.address.toLowerCase().includes(lowercaseQuery)
    )
  );
};

export const getUniqueCategories = (): string[] => {
  // Filter out Gastronomie category
  const categories = new Set(
    typedRetailersData.retailers
      .filter(r => r.category !== 'Gastronomie')
      .map(r => r.category)
  );
  return ['Alle', ...Array.from(categories).sort()];
};

export const getUniqueAreas = (): string[] => {
  const areas = new Set(typedRetailersData.retailers.map(r => r.area));
  return Array.from(areas).sort();
};

export const getRetailersMetadata = () => {
  return typedRetailersData.meta;
};