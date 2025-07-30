import React from 'react';
import { MaterialsManagement } from '@/components/Materials/MaterialsManagement';
import { MaterialItem } from '@/types';

interface MaterialsPageProps {
  onUpdateMaterial: (materialId: string, updates: Partial<MaterialItem>) => void;
}

export const MaterialsPage: React.FC<MaterialsPageProps> = ({
  onUpdateMaterial
}) => {
  return (
    <MaterialsManagement 
      onUpdateMaterial={onUpdateMaterial}
    />
  );
};