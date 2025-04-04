"use client";

import React, { useState } from 'react';
import { TherapyCard } from './TherapyCard';
import { getAllTherapyTypes, getTherapyOfferings } from '@/data/therapyOfferings/utils';
import { TherapyType } from '@/data/therapyOfferings/types';

interface TherapyGridProps {
  therapies?: TherapyType[];
  className?: string;
  displayAll?: boolean;
  displayIds?: string[];
  title?: string;
  subtitle?: string;
}

export const TherapyGrid: React.FC<TherapyGridProps> = ({ 
  therapies, 
  className = '',
  displayAll = true,
  displayIds = [],
  title = "NOS THÉRAPIES",
  subtitle
}) => {
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState<string | null>(null);
  const offerings = getTherapyOfferings();

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

  // Get a suitable subtitle from the offerings data if not provided
  const displaySubtitle = subtitle || offerings.title;

  return (
    <section className={`py-16 text-[#E9B49F] ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#2D3E3C] border border-[#E9B49F]/30 text-[#E9B49F] px-4 py-2 rounded-[24px] text-sm mb-4">
            {title}
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#E9B49F]">
            {displaySubtitle}
          </h2>
          <p className="text-[#E9B49F]/90">
            {therapyList.length > 0 && therapyList[0].headline}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTherapies.map((therapy, index) => (
            <div key={therapy.id}>
              <TherapyCard 
                therapy={therapy} 
                index={index} 
                onShowPromo={handleShowPromo}
              />
            </div>
          ))}
        </div>
      </div>

      {/* We'd need to implement the modals here, but for now we're just setting up the structure */}
      {/* {showPromoModal && selectedTherapy && (
        <PromoModal
          isOpen={showPromoModal}
          onClose={() => setShowPromoModal(false)}
          therapyId={selectedTherapy}
        />
      )} */}
    </section>
  );
};

export default TherapyGrid;
