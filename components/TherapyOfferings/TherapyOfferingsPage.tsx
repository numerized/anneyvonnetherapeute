"use client";

import React from 'react';
import { TherapyGrid } from './TherapyGrid';
import { getAllTherapyTypes, getTherapyOfferings } from '@/data/therapyOfferings/utils';

interface TherapyOfferingsPageProps {
  displayAll?: boolean;
  displayIds?: string[];
}

const TherapyOfferingsPage: React.FC<TherapyOfferingsPageProps> = ({
  displayAll = true,
  displayIds = []
}) => {
  const offerings = getTherapyOfferings();
  const therapyTypes = getAllTherapyTypes();
  
  return (
    <div className="py-16 bg-[#2D3E3C]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
            QUESTIONNAIRE
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#E9B49F]">
            {offerings.title || "Transformez Votre Vie"}
          </h2>
          <p className="text-[#E9B49F]/70">
            {therapyTypes.length > 0 && therapyTypes[0].headline || "Une approche holistique pour une harmonie durable"}
          </p>
        </div>
        
        {/* Therapy Grid */}
        <TherapyGrid 
          therapies={therapyTypes} 
          displayAll={displayAll}
          displayIds={displayIds}
        />
      </div>
    </div>
  );
};

export default TherapyOfferingsPage;
