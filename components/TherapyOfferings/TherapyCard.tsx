"use client";

import React from 'react';
import { BaseOffering, CoachingType, TherapyType } from '@/data/therapyOfferings/types';
import { BookOpen, Calendar, Heart, MessageSquare, Users } from 'lucide-react';

interface TherapyCardProps {
  therapy: BaseOffering;
  index: number;
  onShowPromo: (therapyId: string) => void;
  commonBenefits?: string[];
}

export const TherapyCard: React.FC<TherapyCardProps> = ({ 
  therapy, 
  index, 
  onShowPromo,
  commonBenefits = []
}) => {
  
  // Get price display
  const getPriceDisplay = () => {
    if ('price' in therapy.mainOffering) {
      // No longer need to include suffix since it's been removed
      return `${therapy.mainOffering.price}€`;
    } else if (therapy.mainOffering.details?.price) {
      return `${therapy.mainOffering.details.price}€`;
    } else if (therapy.pricing) {
      if (typeof therapy.pricing === 'object') {
        return `${therapy.pricing.couple}€/couple · ${therapy.pricing.individual}€/individuel`;
      }
      return `${therapy.pricing}€`;
    } else if (therapy.mainOffering.formulas && therapy.mainOffering.formulas.length > 0) {
      const minPrice = Math.min(...therapy.mainOffering.formulas.map(f => f.price));
      return `à partir de ${minPrice}€`;
    } else {
      return "Prix sur demande";
    }
  };
  
  // Get proverbs or other quotes based on offering type
  const getQuotes = () => {
    if ((therapy as TherapyType).proverbs) {
      return (therapy as TherapyType).proverbs;
    } else if ((therapy as CoachingType).promises) {
      return (therapy as CoachingType).promises;
    }
    return [];
  };
  
  // Get price details text
  const getPriceDetails = () => {
    if (therapy.mainOffering.note) {
      return therapy.mainOffering.note;
    } else if (therapy.mainOffering.details?.price) {
      return "pour le programme complet";
    } else if (therapy.mainOffering.formulas && therapy.mainOffering.formulas.length > 0 && therapy.mainOffering.formulas[0].priceDetails) {
      return therapy.mainOffering.formulas[0].priceDetails;
    }
    return "";
  };
  
  // Get organization points
  const getOrganizationPoints = () => {
    if (therapy.id === 'individual') {
      return [
        "Définissez votre thème thérapeutique",
        "Check-list + notes préalables et objectifs - à faire"
      ];
    }
    
    return therapy.options && therapy.options.length > 0
      ? ["Option personnalisée", "Objectifs prédéfinis"]
      : ["Programme détaillé", "Organisation flexible"];
  };
  
  // Get unique benefits/features specific to this therapy
  const getUniqueBenefits = () => {
    if (Array.isArray(therapy.mainOffering.uniqueBenefits)) {
      return therapy.mainOffering.uniqueBenefits;
    } else if (therapy.mainOffering.uniqueBenefits && typeof therapy.mainOffering.uniqueBenefits === 'object' && 'list' in therapy.mainOffering.uniqueBenefits) {
      return therapy.mainOffering.uniqueBenefits.list;
    }
    return [];
  };
  
  // Get common benefits from the top level
  const getCommonBenefits = () => {
    return commonBenefits || [];
  };

  // If commonBenefits prop is empty, use these defaults
  const getDefaultCommonBenefits = () => {
    return [
      "SMS WhatsApp chaque semaine : Vous posez une question, vous obtenez une réponse audio personnalisée.",
      "Accès gratuit à la plateforme pendant 2 ans : Accédez à des ressources exclusives et des événements en ligne pour soutenir votre transformation.",
      "Délocalisation des thérapies : Profitez de l'accompagnement, peu importe où vous vous trouvez, avec des sessions délocalisées accessibles partout"
    ];
  };
  
  // Get all formulas if available
  const getFormulas = () => {
    if (therapy.mainOffering.formulas && therapy.mainOffering.formulas.length > 0) {
      return therapy.mainOffering.formulas;
    }
    return [];
  };

  // Get all options if available
  const getOptions = () => {
    if (therapy.options && therapy.options.length > 0) {
      return therapy.options;
    }
    return [];
  };
  
  // Get quote or proverb
  const getQuote = () => {
    const quotes = getQuotes();
    if (quotes && quotes.length > 0) {
      return quotes[0];
    }
    // Fallback to mainOffering.quote if available
    if (therapy.mainOffering.quote) {
      return therapy.mainOffering.quote;
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
  const benefits = getUniqueBenefits();
  const commonBenefitsArray = commonBenefits.length > 0 ? commonBenefits : getDefaultCommonBenefits();
  
  // Get resources/inclusions
  const getResources = () => {
    const mainOfferingInclusions = therapy.mainOffering.details?.inclusions || [];
    return mainOfferingInclusions;
  };
  
  // Generate a short title from the therapy title for use in the pricing section
  const getShortTitle = (): string => {
    // Extract first word or first two words if very short
    const words = therapy.title.split(' ');
    if (words.length === 0) return "OFFRE";
    
    // If it's a single word or the first word is very short, use it
    if (words.length === 1 || words[0].length > 3) {
      return words[0].toUpperCase();
    }
    
    // Otherwise use the first two words
    return `${words[0]} ${words[1]}`.toUpperCase();
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
        
        {/* Price Section */}
        <div className="bg-primary-forest/30 rounded-[24px] p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-primary-coral font-light text-left">
              {therapy.mainOffering.details?.title || `VOTRE ${getShortTitle()}`}
            </h3>
            
            {/* Main offering price */}
            {('price' in therapy.mainOffering || therapy.mainOffering.details?.price) && (
              <div className="flex items-end gap-1 justify-start">
                <p className="text-4xl text-primary-cream font-light">{getPriceDisplay()}</p>
                <p className="text-primary-cream/70 pb-1">
                  {getPriceDetails()}
                </p>
              </div>
            )}

            {/* Pricing for VIT à la carte */}
            {therapy.pricing && typeof therapy.pricing === 'object' && (
              <div className="space-y-1 mt-2 text-right">
                <p className="text-base text-primary-cream font-light">Prix à la séance:</p>
                <p className="text-sm text-primary-cream/90">Couple: {therapy.pricing.couple}€</p>
                <p className="text-sm text-primary-cream/90">Individuel: {therapy.pricing.individual}€</p>
              </div>
            )}
            
            {/* Formulas if available */}
            {getFormulas().length > 0 && (
              <div className="space-y-3 mt-3">
                <p className="text-xl text-primary-cream font-light">Formules disponibles:</p>
                {getFormulas().map((formula, idx) => (
                  <div key={idx} className="bg-primary-dark/30 p-3 rounded-[16px]">
                    <div className="text-primary-cream font-bold">
                      <h4 className="font-bold">{formula.title}</h4>
                    </div>
                    <p className="text-primary-cream">{formula.price}€</p>

                    {formula.priceDetails && <p className="text-primary-cream/70 text-sm">{formula.priceDetails}</p>}
                    {formula.duration && <p className="text-primary-cream/70 text-sm">{formula.duration}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Inclusions list */}
            {getResources().length > 0 && (
              <>
                <p className="text-lg text-primary-cream font-light mt-2">Inclus:</p>
                <ul className="text-sm text-primary-cream/70 space-y-2 list-none m-0 p-0">
                  {getResources().map((resource, idx) => (
                    <li key={idx} className="flex items-center gap-2 m-0">
                      <span className="text-primary-coral">♦</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        
        {/* Options if available */}
        {getOptions().length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl text-primary-coral font-light">Options disponibles:</h3>
            {getOptions().map((option, idx) => (
              <div key={idx} className="bg-primary-dark/30 backdrop-blur-sm rounded-[16px] p-4">
                <p className="text-primary-cream font-bold mb-2">{option.title}</p>
                {option.pricing && typeof option.pricing === 'object' && (
                  <div className="text-primary-cream text-sm space-y-1">
                    {option.pricing.couple && (
                      <p>Couple: {option.pricing.couple.price}€/{option.pricing.couple.duration || 'séance'}</p>
                    )}
                    {option.pricing.individual && (
                      <p>Individuel: {option.pricing.individual.price}€/{option.pricing.individual.duration || 'séance'}</p>
                    )}
                  </div>
                )}
                {option.pricing && typeof option.pricing === 'string' && (
                  <p className="text-primary-cream text-sm">{option.pricing}</p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Unique Benefits */}
        {benefits.length > 0 && (
          <div>
            <h3 className="text-xl text-primary-coral font-light mb-4">Avantages Uniques:</h3>
            <div className="space-y-6">
              {benefits.map((benefit, idx) => (
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
