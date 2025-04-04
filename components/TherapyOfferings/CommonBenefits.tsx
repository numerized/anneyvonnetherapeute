"use client";

import React from 'react';
import { Heart, MessageCircle, Globe, BookOpen, Award } from 'lucide-react';

interface CommonBenefitsProps {
  benefits: string[];
}

export const CommonBenefits: React.FC<CommonBenefitsProps> = ({ benefits }) => {
  // Helper function to get benefit icon
  const getBenefitIcon = (benefit: string) => {
    if (benefit.toLowerCase().includes('sms') || benefit.toLowerCase().includes('whatsapp')) {
      return <MessageCircle size={24} />;
    } else if (benefit.toLowerCase().includes('plateforme') || benefit.toLowerCase().includes('accès')) {
      return <BookOpen size={24} />;
    } else if (benefit.toLowerCase().includes('délocalisation') || benefit.toLowerCase().includes('partout')) {
      return <Globe size={24} />;
    } else if (benefit.toLowerCase().includes('capsule') || benefit.toLowerCase().includes('audio')) {
      return <Award size={24} />;
    }
    return <Heart size={24} />;
  };

  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-8">
        <h2 className="text-3xl text-primary-coral font-light mb-8 text-center">Avantages inclus avec toutes nos thérapies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-primary-forest/30 p-6 rounded-[16px]">
              <div className="text-primary-coral mt-1">
                {getBenefitIcon(benefit)}
              </div>
              <div>
                <p className="text-primary-cream/90">{benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommonBenefits;
