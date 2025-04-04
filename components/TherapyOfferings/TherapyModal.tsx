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

  // Helper function to render options section
  const renderOptions = () => {
    if (!hasOptions) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Options</h3>
        <div className="space-y-4">
          {therapy.options?.map((option) => (
            <div 
              key={option.id}
              className="border border-primary-coral/30 rounded-[16px] overflow-hidden"
            >
              <div 
                className="p-4 bg-primary-dark/30 flex justify-between items-center cursor-pointer"
                onClick={() => handleSectionToggle(option.id)}
              >
                <h4 className="font-bold text-primary-cream">{option.title}</h4>
                {activeSection === option.id ? 
                  <ChevronUp className="text-primary-coral" /> : 
                  <ChevronDown className="text-primary-coral" />
                }
              </div>
              {activeSection === option.id && (
                <div className="p-4 bg-primary-forest/30">
                  <p className="text-primary-cream/90 mb-4">{option.description}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      {option.pricing && typeof option.pricing !== 'string' && (
                        <p className="text-primary-cream font-bold">
                          Prix: {option.pricing?.couple?.price || option.pricing?.individual?.price || 0}€
                        </p>
                      )}
                    </div>
                    <button 
                      className="bg-primary-coral hover:bg-primary-rust text-primary-cream px-6 py-2 rounded-[16px] transition-colors"
                    >
                      Choisir cette option
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render formulas section
  const renderFormulas = () => {
    if (!hasFormulas) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Formules</h3>
        <div className="space-y-4">
          {therapy.mainOffering.formulas?.map((formula) => (
            <div 
              key={formula.id}
              className="border border-primary-coral/30 rounded-[16px] overflow-hidden"
            >
              <div 
                className="p-4 bg-primary-dark/30 flex justify-between items-center cursor-pointer"
                onClick={() => handleFormulaToggle(formula.id)}
              >
                <h4 className="font-bold text-primary-cream">{formula.title}</h4>
                {activeFormula === formula.id ? 
                  <ChevronUp className="text-primary-coral" /> : 
                  <ChevronDown className="text-primary-coral" />
                }
              </div>
              {activeFormula === formula.id && (
                <div className="p-4 bg-primary-forest/30">
                  <p className="text-primary-cream/90 mb-4">{formula.features.join(' • ')}</p>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-primary-cream font-bold">
                        Prix: {formula.price}€
                      </p>
                      {formula.priceDetails && (
                        <p className="text-primary-cream/70 text-sm">
                          {formula.priceDetails}
                        </p>
                      )}
                    </div>
                    <button 
                      className="bg-primary-coral hover:bg-primary-rust text-primary-cream px-6 py-2 rounded-[16px] transition-colors"
                    >
                      Choisir cette formule
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
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
    if (!therapy.mainOffering.benefits) return null;
    
    let benefitsList: string[] = [];
    let benefitsIntro = "";
    
    // Handle different format of benefits
    if (Array.isArray(therapy.mainOffering.benefits)) {
      benefitsList = therapy.mainOffering.benefits;
    } else if (typeof therapy.mainOffering.benefits === 'object') {
      benefitsList = therapy.mainOffering.benefits.list || [];
      benefitsIntro = therapy.mainOffering.benefits.intro || "";
    }
    
    if (benefitsList.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Bénéfices</h3>
        {benefitsIntro && (
          <p className="text-primary-cream/90 mb-4">{benefitsIntro}</p>
        )}
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          <ul className="space-y-3">
            {benefitsList.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-coral mr-2 mt-1">♦</span>
                <span className="text-primary-cream/90">{benefit}</span>
              </li>
            ))}
          </ul>
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
        >
          <X size={24} />
        </button>
        
        <div className="mb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 className="text-2xl md:text-3xl font-light text-primary-cream">
              {therapy.title}
            </h2>
            <div className="bg-primary-coral text-primary-cream px-3 py-1 rounded-[12px] text-sm uppercase">
              {therapy.category || "Thérapie"}
            </div>
          </div>
          {therapy.subtitle && (
            <p className="text-primary-coral italic">{therapy.subtitle}</p>
          )}
        </div>
        
        {renderProverbs()}
        {renderProcess()}
        {renderBenefits()}
        {renderThemes()}
        {renderFormulas()}
        {renderOptions()}
        
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
