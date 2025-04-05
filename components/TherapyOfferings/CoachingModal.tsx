"use client";

import React from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { getCoachingTypeById } from '@/data/therapyOfferings/utils';
import { CoachingType } from '@/data/therapyOfferings/types';

interface CoachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  coachingId: string;
}

export const CoachingModal: React.FC<CoachingModalProps> = ({ isOpen, onClose, coachingId }) => {
  const coaching = getCoachingTypeById(coachingId);
  
  console.log('CoachingModal rendering with ID:', coachingId);
  console.log('Coaching data retrieved:', coaching);

  if (!isOpen || !coaching) {
    console.log('CoachingModal not rendering - isOpen:', isOpen, 'coaching found:', !!coaching);
    return null;
  }

  // Helper function to determine if the coaching has options
  const hasOptions = coaching.options && coaching.options.length > 0;

  // Helper function to render promises section
  const renderPromises = () => {
    if (!coaching.mainOffering.promises || coaching.mainOffering.promises.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Ce que je te promets</h3>
        <div className="space-y-4">
          {coaching.mainOffering.promises.map((promise, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-primary-coral text-lg">✓</span>
              <p className="text-primary-cream/90">{promise}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render themes section
  const renderThemes = () => {
    if (!coaching.themes || coaching.themes.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Thèmes abordés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coaching.themes.map((theme, index) => (
            <div key={index} className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
              <h4 className="font-bold text-primary-cream mb-2">{theme.title}</h4>
              <p className="text-primary-cream/80">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to safely get price value
  const getPriceValue = (priceObj: any): number => {
    if (typeof priceObj === 'number') {
      return priceObj;
    } else if (priceObj && typeof priceObj === 'object' && 'price' in priceObj) {
      return priceObj.price;
    }
    return 0;
  };

  // Helper function to format pricing display with details
  const formatPriceDisplay = (price: number, note?: string, priceDetails?: string) => {
    let priceText = `${price}€`;
    
    if (note) {
      return `${priceText} (${note})`;
    }
    
    if (priceDetails) {
      return `${priceText} ${priceDetails}`;
    }
    
    return priceText;
  };

  // Helper function to render process section
  const renderProcess = () => {
    if (!coaching.mainOffering.process) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">
          {coaching.mainOffering.process.title || "Processus"}
        </h3>
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          <ul className="space-y-3">
            {coaching.mainOffering.process.details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-coral mr-2 mt-1">♦</span>
                <span className="text-primary-cream/90">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Helper function to render benefits section
  const renderBenefits = () => {
    if (!coaching.mainOffering) return null;
    
    if (!coaching.mainOffering.uniqueBenefits) return null;
    
    if (Array.isArray(coaching.mainOffering.uniqueBenefits)) {
      return (
        <div className="space-y-8 mt-12">
          <h3 className="text-primary-cream text-xl font-bold">Les avantages</h3>
          <div className="space-y-6">
            {coaching.mainOffering.uniqueBenefits.map((benefit, idx) => (
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
      );
    } else {
      // Handle object-style benefits
      return (
        <div className="space-y-8 mt-12">
          <h3 className="text-primary-cream text-xl font-bold">{coaching.mainOffering.uniqueBenefits.title}</h3>
          {coaching.mainOffering.uniqueBenefits.intro && (
            <p className="text-primary-cream/70">{coaching.mainOffering.uniqueBenefits.intro}</p>
          )}
          <div className="space-y-6">
            {coaching.mainOffering.uniqueBenefits.list.map((benefit, idx) => (
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
      );
    }
  };

  // Helper function to get benefit icon
  const getBenefitIcon = (benefit: string) => {
    return <span>✓</span>;
  };

  // Helper function to render main offering details
  const renderMainOfferingDetails = () => {
    if (!coaching.mainOffering.details) return null;
    const details = coaching.mainOffering.details;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">{details.title || "Détails"}</h3>
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          {details.schedule && (
            <p className="text-primary-cream mb-2">{details.schedule}</p>
          )}
          
          <div className="flex flex-col mb-4">
            <p className="text-3xl font-light text-primary-coral mb-2">
              {formatPriceDisplay(coaching.mainOffering.price || 0, '', 'pour le programme complet')}
            </p>
            <p className="text-primary-cream/90">{details.duration}</p>
            <p className="text-primary-cream/90">{details.sessionLength}</p>
          </div>
          
          {details.inclusions && (
            <div>
              <p className="text-primary-cream font-bold mb-2">Inclus:</p>
              <ul className="space-y-1">
                {details.inclusions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-coral mr-2">✓</span>
                    <span className="text-primary-cream/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="bg-primary-forest/90 backdrop-blur-sm rounded-[24px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary-forest z-10 p-6 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl text-primary-coral font-light">{coaching.title}</h2>
              <p className="text-primary-cream/70">{coaching.subtitle}</p>
            </div>
            <button 
              onClick={onClose} 
              className="bg-primary-dark/40 hover:bg-primary-dark/60 p-2 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="text-primary-cream w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 pt-4">
          <div className="space-y-8">
            <p className="text-primary-cream text-lg">{coaching.description}</p>
            
            {/* Benefits */}
            {renderBenefits()}
            
            {/* Promises */}
            {renderPromises()}
            
            {/* Process */}
            {renderProcess()}
            
            {/* Main offering details */}
            {renderMainOfferingDetails()}
            
            {/* Themes */}
            {renderThemes()}
            
            {/* Options section if available */}
            {hasOptions && coaching.options && (
              <div className="space-y-8 mt-8">
                <h3 className="text-2xl font-medium text-primary-coral">Options supplémentaires</h3>
                
                <div className="space-y-8">
                  {coaching.options.map((option, index) => (
                    <div key={index} className="bg-primary-dark/30 backdrop-blur-sm p-6 rounded-[16px]">
                      <h4 className="text-xl font-bold text-primary-cream mb-4">{option.title}</h4>
                      <p className="text-primary-cream/80 mb-4">{option.description}</p>
                      
                      {option.sections && option.sections.map((section, idx) => (
                        <div key={idx} className="mb-4">
                          <h5 className="text-lg font-medium text-primary-coral mb-2">{section.title}</h5>
                          {section.content && <p className="text-primary-cream/90 mb-2">{section.content}</p>}
                          
                          {section.bulletPoints && section.bulletPoints.length > 0 && (
                            <ul className="space-y-1 ml-4">
                              {section.bulletPoints.map((point, bulletIdx) => (
                                <li key={bulletIdx} className="flex items-start">
                                  <span className="text-primary-coral mr-2">•</span>
                                  <span className="text-primary-cream/80">{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      
                      {/* Features */}
                      {option.features && option.features.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-lg font-medium text-primary-coral mb-2">Caractéristiques</h5>
                          <ul className="space-y-1">
                            {option.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-primary-coral mr-2">✓</span>
                                <span className="text-primary-cream/90">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Pricing */}
                      {option.pricing && (
                        <div className="mt-4 bg-primary-dark/40 p-4 rounded-[16px]">
                          <h5 className="text-lg font-medium text-primary-coral mb-2">Tarif</h5>
                          {typeof option.pricing === 'string' ? (
                            <p className="text-primary-cream">{option.pricing}</p>
                          ) : (
                            <div className="space-y-2">
                              {option.pricing.individual && (
                                <div>
                                  <p className="text-primary-cream font-bold">Individuel:</p>
                                  <p className="text-primary-cream">{option.pricing.individual.price}€ - {option.pricing.individual.duration}</p>
                                </div>
                              )}
                              {option.pricing.couple && (
                                <div>
                                  <p className="text-primary-cream font-bold">Couple:</p>
                                  <p className="text-primary-cream">{option.pricing.couple.price}€ - {option.pricing.couple.duration}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
