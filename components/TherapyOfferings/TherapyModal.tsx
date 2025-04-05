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
  const [activeSection, setActiveSection] = React.useState<string>('main');
  const [activeFormula, setActiveFormula] = React.useState<string | null>(null);
  const therapy = getTherapyTypeById(therapyId);

  if (!isOpen || !therapy) return null;

  const handleSectionToggle = (section: string) => {
    setActiveSection(activeSection === section ? 'main' : section);
  };

  const handleFormulaToggle = (formulaId: string) => {
    setActiveFormula(activeFormula === formulaId ? null : formulaId);
  };

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
          <h3 className="text-primary-cream text-xl font-bold">{therapy.mainOffering.uniqueBenefits.title}</h3>
          {therapy.mainOffering.uniqueBenefits.intro && (
            <p className="text-primary-cream/70">{therapy.mainOffering.uniqueBenefits.intro}</p>
          )}
          <div className="space-y-6">
            {therapy.mainOffering.uniqueBenefits.list.map((benefit, idx) => (
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
    // Add logic to return the correct icon based on the benefit
    // For now, just return a placeholder icon
    return <span>✓</span>;
  };

  // Helper function to render main offering details
  const renderMainOfferingDetails = () => {
    if (!therapy.mainOffering.details) return null;
    const details = therapy.mainOffering.details;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">{details.title || "Détails"}</h3>
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          <p className="text-primary-cream mb-2">{details.duration}</p>
          <p className="text-primary-cream mb-2">{details.schedule}</p>
          <p className="text-primary-cream mb-4">{details.sessionLength}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <p className="text-3xl font-light text-primary-coral">{formatPriceDisplay(details.price, '', 'pour le programme complet')}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-auto">
      <div className="bg-primary-forest max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-[24px] shadow-lg p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-primary-cream hover:text-primary-coral transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <div className="mb-6">
          <h2 className="text-3xl font-light text-primary-cream mb-2">
            {therapy.title}
          </h2>
          <p className="text-xl text-primary-coral mb-2">{therapy.subtitle}</p>
          <p className="text-primary-cream/80">{therapy.headline}</p>
        </div>
        
        <div className="mb-8">
          <p className="text-primary-cream/90 leading-relaxed">
            {therapy.description}
          </p>
        </div>
        
        {renderProverbs()}
        {renderThemes()}
        {renderProcess()}
        {renderBenefits()}
        
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary-coral hover:bg-primary-rust text-primary-cream px-6 py-2 rounded-[16px] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
