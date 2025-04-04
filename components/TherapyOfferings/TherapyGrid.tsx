"use client";

import React, { useState } from 'react';
import { TherapyCard } from './TherapyCard';
import { getAllTherapyTypes } from '@/data/therapyOfferings/utils';
import { TherapyType } from '@/data/therapyOfferings/types';
import { TherapyModal } from './TherapyModal';

interface TherapyGridProps {
  therapies?: TherapyType[];
  className?: string;
  displayAll?: boolean;
  displayIds?: string[];
}

export const TherapyGrid: React.FC<TherapyGridProps> = ({ 
  therapies, 
  className = '',
  displayAll = true,
  displayIds = []
}) => {
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState<string | null>(null);

  // Get therapies from props or fetch all if not provided
  const therapyList = therapies || getAllTherapyTypes();
  
  // Filter therapies if displayAll is false and displayIds is provided
  const filteredTherapies = displayAll 
    ? therapyList 
    : therapyList.filter(therapy => displayIds.includes(therapy.id));

  const handleShowPromo = (therapyId: string) => {
    setSelectedTherapy(therapyId);
    setShowPromoModal(true);
  };

  const handleCloseModal = () => {
    setShowPromoModal(false);
    setSelectedTherapy(null);
  };

  return (
    <div className={`${className}`}>
      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTherapies.map((therapy, index) => (
          <div key={therapy.id} className="h-full">
            <TherapyCard 
              therapy={therapy} 
              index={index} 
              onShowPromo={handleShowPromo}
            />
          </div>
        ))}
      </div>

      {/* TherapyModal for displaying additional information */}
      {showPromoModal && selectedTherapy && (
        <TherapyModal
          isOpen={showPromoModal}
          onClose={handleCloseModal}
          therapyId={selectedTherapy}
        />
      )}
    </div>
  );
};

export default TherapyGrid;
