import { useState, useEffect } from 'react';
import { MaterialItem } from '@/types';
import { mockMaterials } from '@/data/mockData';

interface UseMaterialsParams {
  category?: string;
  supplier?: string;
  lowStockOnly?: boolean;
  refreshInterval?: number; // Auto-refresh interval in milliseconds
}

interface UseMaterialsReturn {
  materials: MaterialItem[];
  loading: boolean;
  error: string | null;
  refreshMaterials: () => Promise<void>;
  updateMaterial: (materialId: string, updates: Partial<MaterialItem>) => Promise<void>;
  getMaterialById: (id: string) => MaterialItem | undefined;
  getMaterialsByCategory: (category: string) => MaterialItem[];
  getMaterialsBySupplier: (supplier: string) => MaterialItem[];
  getLowStockMaterials: (threshold?: number) => MaterialItem[];
}

export const useMaterials = (params: UseMaterialsParams = {}): UseMaterialsReturn => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { category, supplier, lowStockOnly, refreshInterval } = params;

  const fetchMaterials = async (): Promise<MaterialItem[]> => {
    try {
      // TODO: Replace with actual API call
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (supplier) queryParams.append('supplier', supplier);
      if (lowStockOnly) queryParams.append('lowStockOnly', 'true');

      // const response = await fetch(`/api/materials?${queryParams.toString()}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch materials: ${response.statusText}`);
      // }
      // return await response.json();
      
      // For now, simulate API call with mock data and filtering
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      let filteredMaterials = [...mockMaterials];
      
      // Apply client-side filtering (in real app, this would be done server-side)
      if (category) {
        filteredMaterials = filteredMaterials.filter(material => 
          material.category.toLowerCase().includes(category.toLowerCase())
        );
      }
      
      if (supplier) {
        filteredMaterials = filteredMaterials.filter(material => 
          material.supplier.toLowerCase().includes(supplier.toLowerCase())
        );
      }
      
      if (lowStockOnly) {
        filteredMaterials = filteredMaterials.filter(material => 
          material.quantityAvailable < 10
        );
      }
      
      return filteredMaterials;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch materials');
    }
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedMaterials = await fetchMaterials();
      setMaterials(fetchedMaterials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshMaterials = async () => {
    await loadMaterials();
  };

  const updateMaterial = async (
    materialId: string, 
    updates: Partial<MaterialItem>
  ) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/materials/${materialId}`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(updates)
      // });
      // if (!response.ok) {
      //   throw new Error(`Failed to update material: ${response.statusText}`);
      // }
      // const updatedMaterial = await response.json();

      // For now, update locally
      setMaterials(prevMaterials => 
        prevMaterials.map(material => 
          material.id === materialId 
            ? { ...material, ...updates }
            : material
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update material');
    }
  };

  const getMaterialById = (id: string): MaterialItem | undefined => {
    return materials.find(material => material.id === id);
  };

  const getMaterialsByCategory = (category: string): MaterialItem[] => {
    return materials.filter(material => 
      material.category.toLowerCase().includes(category.toLowerCase())
    );
  };

  const getMaterialsBySupplier = (supplier: string): MaterialItem[] => {
    return materials.filter(material => 
      material.supplier.toLowerCase().includes(supplier.toLowerCase())
    );
  };

  const getLowStockMaterials = (threshold: number = 10): MaterialItem[] => {
    return materials.filter(material => material.quantityAvailable < threshold);
  };

  // Initial load
  useEffect(() => {
    loadMaterials();
  }, [category, supplier, lowStockOnly]); // Reload when parameters change

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        refreshMaterials();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return {
    materials,
    loading,
    error,
    refreshMaterials,
    updateMaterial,
    getMaterialById,
    getMaterialsByCategory,
    getMaterialsBySupplier,
    getLowStockMaterials
  };
};