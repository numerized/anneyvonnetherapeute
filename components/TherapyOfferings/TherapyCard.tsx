"use client";

import React from 'react';
import { TherapyType } from '@/data/therapyOfferings/types';
import { BookOpen, Calendar, Heart, MessageSquare, Users } from 'lucide-react';

interface TherapyCardProps {
  therapy: TherapyType;
  index: number;
  onShowPromo: (therapyId: string) => void;
}

export const TherapyCard: React.FC<TherapyCardProps> = ({ therapy, index, onShowPromo }) => {
  
  // Get price display
  const getPriceDisplay = () => {
    if ('price' in therapy.mainOffering) {
      return `${therapy.mainOffering.price} €`;
    } else if (therapy.mainOffering.details?.price) {
      return `${therapy.mainOffering.details.price} €`;
    } else if (therapy.mainOffering.formulas && therapy.mainOffering.formulas.length > 0) {
      const minPrice = Math.min(...therapy.mainOffering.formulas.map(f => f.price));
      return `à partir de ${minPrice} €`;
    } else {
      return "Prix sur demande";
    }
  };
  
  // Get organization points
  const getOrganizationPoints = () => {
    const points: string[] = [];
    
    if (therapy.mainOffering.details?.duration) {
      points.push(therapy.mainOffering.details.duration);
    }
    
    if (therapy.mainOffering.details?.schedule) {
      points.push(therapy.mainOffering.details.schedule);
    }
    
    if (therapy.mainOffering.details?.sessionLength) {
      points.push(therapy.mainOffering.details.sessionLength);
    }
    
    if (therapy.mainOffering.process?.details) {
      points.push(...therapy.mainOffering.process.details);
    }
    
    return points;
  };
  
  // Get benefits/features
  const getBenefits = () => {
    if (Array.isArray(therapy.mainOffering.benefits)) {
      return therapy.mainOffering.benefits;
    } else if (therapy.mainOffering.benefits && typeof therapy.mainOffering.benefits === 'object' && 'list' in therapy.mainOffering.benefits) {
      return therapy.mainOffering.benefits.list;
    }
    return [];
  };
  
  // Get quote or proverb
  const getQuote = () => {
    if (therapy.mainOffering.quote) {
      return therapy.mainOffering.quote;
    } else if (therapy.proverbs && therapy.proverbs.length > 0) {
      return therapy.proverbs[0];
    }
    return "";
  };
  
  // Get subtitle (either from therapy subtitle or category)
  const getSubtitle = () => {
    if (therapy.subtitle) {
      return therapy.subtitle;
    } else if (therapy.category) {
      return therapy.category;
    }
    return "";
  };
  
  // Get organization sections
  const organizationPoints = getOrganizationPoints();
  const benefits = getBenefits();
  
  // Get resources/inclusions
  const getResources = () => {
    if (therapy.mainOffering.details?.inclusions) {
      return therapy.mainOffering.details.inclusions;
    }
    return [];
  };
  
  // Get appropriate icon for different benefit types
  const getBenefitIcon = (benefit: string) => {
    const lowerBenefit = benefit.toLowerCase();
    if (lowerBenefit.includes('whatsapp') || lowerBenefit.includes('support') || lowerBenefit.includes('message')) {
      return <MessageSquare size={24} />;
    } else if (lowerBenefit.includes('plateforme') || lowerBenefit.includes('ressource') || lowerBenefit.includes('accès')) {
      return <BookOpen size={24} />;
    } else if (lowerBenefit.includes('amour') || lowerBenefit.includes('relation') || lowerBenefit.includes('couple')) {
      return <Heart size={24} />;
    } else {
      return <Calendar size={24} />;
    }
  };
  
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors">
      <div className="space-y-12">
        {/* Title and Subtitle */}
        <div className="text-right">
          <h3 className="text-2xl text-primary-cream font-light mb-2">
            {therapy.title.toUpperCase()}
          </h3>
          {getSubtitle() && (
            <p className="text-primary-coral italic">{getSubtitle()}</p>
          )}
        </div>
        
        {/* Quote */}
        {getQuote() && (
          <blockquote className="border-l-4 border-primary-coral pl-4 my-4 text-left">
            <p className="text-primary-cream/90 italic">"{getQuote()}"</p>
          </blockquote>
        )}
        
        {/* Organization */}
        {organizationPoints.length > 0 && (
          <div className="space-y-6">
            <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
              <p className="text-primary-cream/90 mb-2">
                <strong>Organisation</strong>
              </p>
              <ul className="text-sm text-primary-cream/70 space-y-2 list-none m-0 p-0">
                {organizationPoints.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-2 m-0">
                    <span className="text-primary-coral">♦</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Price Section (only for couple therapy) */}
        {therapy.id === 'couple' && (
          <div className="bg-primary-forest/30 rounded-[24px] p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl text-primary-coral font-light text-left">
                VOTRE THÉRAPIE DE COUPLE
              </h3>
              <div className="flex items-end gap-1 justify-start">
                <p className="text-4xl text-primary-cream font-light">{getPriceDisplay()}</p>
                <p className="text-primary-cream/70 pb-1">
                  {therapy.mainOffering.details?.price ? "(ou 3 x 880€ mensuel)" : ""}
                </p>
              </div>
              <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
                {getResources().slice(0, 3).map((resource, idx) => (
                  <li key={idx} className="flex items-center gap-2 m-0">
                    <span className="text-primary-coral">♦</span>
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="space-y-6">
            {benefits.slice(0, 3).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="text-primary-coral mt-1">
                  {getBenefitIcon(benefit)}
                </div>
                <div>
                  <p className="text-primary-cream/90">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Ideal For */}
        {therapy.mainOffering.idealFor && (
          <div className="bg-primary-forest/30 rounded-[24px] p-6">
            <div className="flex items-start gap-4">
              <div className="text-primary-coral mt-1">
                <Users size={24} />
              </div>
              <div>
                <h4 className="text-primary-cream font-bold mb-2">Idéal pour</h4>
                <p className="text-primary-cream/90">
                  {therapy.mainOffering.idealFor}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* CTA Button */}
        <button
          onClick={() => onShowPromo(therapy.id)}
          className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-[24px] py-3 font-bold"
        >
          En savoir plus
        </button>
      </div>
    </div>
  );
};
