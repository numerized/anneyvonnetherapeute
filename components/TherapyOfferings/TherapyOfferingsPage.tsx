"use client";

import React from 'react';
import { TherapyGrid } from './TherapyGrid';
import { CommonBenefits } from './CommonBenefits';
import { 
  getAllTherapyTypes, 
  getAllCoachingTypes, 
  getTherapyOfferings, 
  getCoachingOfferings,
  getOfferingsByType
} from '@/data/therapyOfferings/utils';
import { BaseOffering } from '@/data/therapyOfferings/types';

interface TherapyOfferingsPageProps {
  displayAll?: boolean;
  displayIds?: string[];
  offeringType?: 'therapy' | 'coaching';
}

const TherapyOfferingsPage: React.FC<TherapyOfferingsPageProps> = ({
  displayAll = true,
  displayIds = [],
  offeringType = 'therapy'
}) => {
  // Get the offerings and types based on the offering type
  const offerings = offeringType === 'therapy' 
    ? getTherapyOfferings() 
    : getCoachingOfferings();
  
  const offeringTypes = getOfferingsByType(offeringType);
  
  // Get the title and headline based on the offering type
  const title = offerings.title || (offeringType === 'therapy' 
    ? "Transformez Votre Vie avec la Thérapie" 
    : "Transformez Votre Vie avec le Coaching");
  
  const headlineItem = offeringTypes.length > 0 ? offeringTypes[0] : null;
  const headline = headlineItem?.headline || "Une approche holistique pour une harmonie durable";
  
  // Get common benefits
  const commonBenefits = offerings.commonBenefits || [];
  
  // Badge text based on offering type
  const badgeText = offeringType === 'therapy' ? 'THÉRAPIE' : 'COACHING';
  
  return (
    <div className="py-16 bg-[#2D3E3C]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
            {badgeText}
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#E9B49F]">
            {title}
          </h2>
          <p className="text-[#E9B49F]/70">
            {headline}
          </p>
        </div>
        
        {/* Therapy Grid */}
        <TherapyGrid 
          therapies={offeringTypes as BaseOffering[]} 
          displayAll={displayAll}
          displayIds={displayIds}
        />
        
        {/* Common Benefits Section */}
        {commonBenefits.length > 0 && (
          <CommonBenefits benefits={commonBenefits} />
        )}
      </div>
    </div>
  );
};

export default TherapyOfferingsPage;
