"use client";

import React from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { getTherapyTypeById } from '@/data/therapyOfferings/utils';
import { TherapyType } from '@/data/therapyOfferings/types';

interface TherapyModalProps {
  isOpen: boolean;
  onClose: () => void;
  therapyId: string;
}

export const TherapyModal: React.FC<TherapyModalProps> = ({ isOpen, onClose, therapyId }) => {
  const therapy = getTherapyTypeById(therapyId);

  if (!isOpen || !therapy) return null;

  // Helper function to determine if the therapy has options
  const hasOptions = therapy.options && therapy.options.length > 0;
  
  // Helper function to determine if the therapy has formulas
  const hasFormulas = therapy.mainOffering.formulas && therapy.mainOffering.formulas.length > 0;

  // Helper function to render proverbs section
  const renderProverbs = () => {
    if (!therapy.proverbs || therapy.proverbs.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Sagesse</h3>
        <div className="space-y-4">
          {therapy.proverbs.map((proverb, index) => (
            <blockquote key={index} className="border-l-4 border-primary-coral pl-4 italic text-primary-cream/90">
              "{proverb}"
            </blockquote>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render themes section
  const renderThemes = () => {
    if (!therapy.themes || therapy.themes.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Thèmes abordés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {therapy.themes.map((theme, index) => (
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
    if (!therapy.mainOffering.process) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">
          {therapy.mainOffering.process.title || "Processus"}
        </h3>
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          <ul className="space-y-3">
            {therapy.mainOffering.process.details.map((detail, index) => (
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
    if (!therapy.mainOffering) return null;
    
    if (!therapy.mainOffering.uniqueBenefits) return null;
    
    if (Array.isArray(therapy.mainOffering.uniqueBenefits)) {
      return (
        <div className="space-y-8 mt-12">
          <h3 className="text-primary-cream text-xl font-bold">Les avantages</h3>
          <div className="space-y-6">
            {therapy.mainOffering.uniqueBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="text-primary-coral mt-1">
                  {/* Add logic to return the correct icon based on the benefit */}
                  {/* For now, just return a placeholder icon */}
                  <span>✓</span>
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
          <h3 className="text-primary-cream text-xl font-bold">{therapy.mainOffering.uniqueBenefits.title}</h3>
          {therapy.mainOffering.uniqueBenefits.intro && (
            <p className="text-primary-cream/70">{therapy.mainOffering.uniqueBenefits.intro}</p>
          )}
          <div className="space-y-6">
            {therapy.mainOffering.uniqueBenefits.list.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="text-primary-coral mt-1">
                  {/* Add logic to return the correct icon based on the benefit */}
                  {/* For now, just return a placeholder icon */}
                  <span>✓</span>
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

  // Helper function to render main offering details
  const renderMainOfferingDetails = () => {
    if (!therapy.mainOffering.details) return null;
    const details = therapy.mainOffering.details;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">{details.title || "Détails"}</h3>
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          {details.schedule && (
            <p className="text-primary-cream mb-2">{details.schedule}</p>
          )}
          
          <div className="flex flex-col mb-4">
            <p className="text-3xl font-light text-primary-coral mb-2">{formatPriceDisplay(details.price, '', 'pour le programme complet')}</p>
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
              <h2 className="text-2xl md:text-3xl text-primary-coral font-light">{therapy.title}</h2>
              <p className="text-primary-cream/70">{therapy.subtitle}</p>
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
            <p className="text-primary-cream text-lg">{therapy.description}</p>
            
            {/* Render all the content sections */}
            {renderProverbs()}
            {renderThemes()}
            {renderProcess()}
            {renderBenefits()}
            
            {/* Options section if available */}
            {hasOptions && therapy.options && (
              <div className="space-y-8 mt-8">
                <h3 className="text-2xl font-medium text-primary-coral">Options supplémentaires</h3>
                
                <div className="space-y-8">
                  {therapy.options.map((option, index) => (
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
                                <li key={bulletIdx} className="text-primary-cream/80 flex items-start gap-2">
                                  <span className="text-primary-coral">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Formulas section if available */}
            {hasFormulas && therapy.mainOffering.formulas && (
              <div className="space-y-8 mt-8">
                <h3 className="text-2xl font-medium text-primary-coral">Formules disponibles</h3>
                
                <div className="space-y-6">
                  {therapy.mainOffering.formulas.map((formula) => (
                    <div key={formula.id} className="bg-primary-dark/30 backdrop-blur-sm rounded-[16px] p-6">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-primary-cream">{formula.title}</h4>
                        {formula.price && (
                          <p className="text-primary-cream/70 text-lg font-light">{formula.price}€</p>
                        )}
                      </div>
                      
                      <div>
                        {formula.priceDetails && (
                          <div className="mb-4">
                            <h5 className="text-lg font-medium text-primary-coral mb-1">Détails du prix</h5>
                            <p className="text-primary-cream">{formula.priceDetails}</p>
                          </div>
                        )}
                        
                        {formula.duration && (
                          <div className="mb-4">
                            <h5 className="text-lg font-medium text-primary-coral mb-1">Durée</h5>
                            <p className="text-primary-cream">{formula.duration}</p>
                          </div>
                        )}
                        
                        {formula.note && (
                          <div className="mb-4">
                            <h5 className="text-lg font-medium text-primary-coral mb-1">Note</h5>
                            <p className="text-primary-cream">{formula.note}</p>
                          </div>
                        )}
                        
                        {formula.features && formula.features.length > 0 && (
                          <div>
                            <h5 className="text-lg font-medium text-primary-coral mb-2">Caractéristiques</h5>
                            <ul className="space-y-1">
                              {formula.features.map((feature, idx) => (
                                <li key={idx} className="text-primary-cream/80 flex items-start gap-2">
                                  <span className="text-primary-coral">✓</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
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
