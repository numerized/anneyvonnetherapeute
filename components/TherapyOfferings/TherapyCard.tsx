"use client";

import React from 'react';
import { TherapyType } from '@/data/therapyOfferings/types';
import Link from 'next/link';
import { BookOpen, Calendar, Heart, MessageSquare, Users } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface TherapyCardProps {
  therapy: TherapyType;
  index: number;
  onShowPromo?: (therapyId: string) => void;
}

// Define interfaces for optional properties that might not be in the main types
interface TherapyResource {
  type: string;
  title: string;
  description: string;
}

export const TherapyCard: React.FC<TherapyCardProps> = ({ therapy, index, onShowPromo }) => {
  // Extract pricing information
  const getPriceDisplay = () => {
    if (therapy.pricing) {
      return `${therapy.pricing.couple} €`;
    } else if (therapy.mainOffering && therapy.mainOffering.details && therapy.mainOffering.details.price) {
      return `${therapy.mainOffering.details.price} €`;
    } else if (therapy.mainOffering && therapy.mainOffering.formulas && therapy.mainOffering.formulas[0] && therapy.mainOffering.formulas[0].price) {
      const formula = therapy.mainOffering.formulas[0];
      return `${formula.price} €`;
    }
    return null;
  };

  // Get organization points for the card
  const getOrganizationPoints = () => {
    if (therapy.id === 'couple' && therapy.mainOffering && therapy.mainOffering.process && therapy.mainOffering.process.details) {
      return therapy.mainOffering.process.details;
    } else if (therapy.id === 'individual' && therapy.mainOffering && therapy.mainOffering.formulas) {
      const formula = therapy.mainOffering.formulas.find(f => f.id === 'compact');
      return formula?.features || [];
    } else {
      return therapy.mainOffering && therapy.mainOffering.features ? therapy.mainOffering.features : [];
    }
  };

  // Get benefits points for the card
  const getBenefits = () => {
    if (therapy.mainOffering && typeof therapy.mainOffering.benefits === 'object' && 'list' in therapy.mainOffering.benefits) {
      return therapy.mainOffering.benefits.list.slice(0, 3);
    } else if (therapy.mainOffering && Array.isArray(therapy.mainOffering.benefits)) {
      return therapy.mainOffering.benefits.slice(0, 3);
    }
    return [];
  };

  // Get payment options if available
  const getPaymentOption = () => {
    // Check if therapy details or formulas have paymentOptions as a custom property
    if (therapy.id === 'couple' && therapy.mainOffering && therapy.mainOffering.details) {
      // Use type assertion to access potential paymentOptions
      const details = therapy.mainOffering.details as any;
      return details.paymentOptions || null;
    } else if (therapy.id === 'individual' && therapy.mainOffering && therapy.mainOffering.formulas && therapy.mainOffering.formulas[0]) {
      // Use type assertion to access potential paymentOptions
      const formula = therapy.mainOffering.formulas[0] as any;
      return formula.paymentOptions || null;
    }
    return null;
  };

  const handleClick = () => {
    if (onShowPromo) {
      onShowPromo(therapy.id);
    }
  };

  // Get additional benefits
  const getAdditionalBenefits = () => {
    // Use type assertion to access these potentially undefined properties
    const mainOffering = therapy.mainOffering as any;
    
    if (therapy.id === 'couple' && mainOffering.additionalFeatures) {
      return mainOffering.additionalFeatures as string[];
    } else if (mainOffering.additionalIncludes) {
      return mainOffering.additionalIncludes as string[];
    }
    return [];
  };

  // Get therapy title for pricing section
  const getTherapyTitle = () => {
    if (therapy.id === 'couple') {
      return "VOTRE THÉRAPIE DE COUPLE";
    } else if (therapy.id === 'individual') {
      return "VOTRE THÉRAPIE INDIVIDUELLE";
    } else {
      return `VOTRE THÉRAPIE ${therapy.title.toUpperCase()}`;
    }
  };

  // Get resources if they exist
  const getResources = (): TherapyResource[] => {
    // Use type assertion to access potentially undefined resources
    const mainOffering = therapy.mainOffering as any;
    return mainOffering.resources || [];
  };

  return (
    <div 
      className="relative overflow-hidden rounded-[32px] bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors h-full"
    >
      <div className="space-y-12">
        {/* Header */}
        <div className="text-right">
          <h3 className="text-2xl text-primary-cream font-light mb-2">
            {therapy.title}
          </h3>
          {therapy.subtitle && (
            <p className="text-primary-coral italic">
              {therapy.subtitle}
            </p>
          )}
        </div>

        {/* Quote */}
        <blockquote className="border-l-4 border-primary-coral pl-4 my-4 text-left">
          <p className="text-primary-cream/90 italic">
            "{therapy.mainOffering && therapy.mainOffering.quote || (therapy.proverbs && therapy.proverbs.length > 0 ? therapy.proverbs[0] : "")}"
          </p>
        </blockquote>

        {/* Organization Section */}
        <div className="space-y-6">
          <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
            <p className="text-primary-cream/90 mb-2">
              <strong>Organisation</strong>
            </p>
            <ul className="text-sm text-primary-cream/70 space-y-2 list-none m-0 p-0">
              {getOrganizationPoints().map((point, i) => (
                <li key={i} className="flex items-center gap-2 m-0">
                  <span className="text-primary-coral">♦</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Price Section */}
        {getPriceDisplay() && (
          <div className="bg-primary-forest/30 rounded-[24px] p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl text-primary-coral font-light text-left">
                {getTherapyTitle()}
              </h3>
              <div className="flex items-end gap-1 justify-start">
                <p className="text-4xl text-primary-cream font-light">{getPriceDisplay()}</p>
                {getPaymentOption() && (
                  <p className="text-primary-cream/70 pb-1">
                    {getPaymentOption()}
                  </p>
                )}
              </div>
              
              {/* Additional benefits */}
              {getAdditionalBenefits().length > 0 && (
                <ul className="text-sm text-primary-cream/70 space-y-2 mt-2 list-none m-0 p-0">
                  {getAdditionalBenefits().slice(0, 3).map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 m-0">
                      <span className="text-primary-coral">♦</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="space-y-6">
          <div className="space-y-6">
            {getResources().length > 0 && getResources().map((resource, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-primary-coral">
                  {resource.type === 'message' ? (
                    <MessageSquare size={24} />
                  ) : resource.type === 'book' ? (
                    <BookOpen size={24} />
                  ) : (
                    <Heart size={24} />
                  )}
                </div>
                <div>
                  <h4 className="text-primary-cream font-bold mb-1">{resource.title}</h4>
                  <p className="text-primary-cream/70 text-sm">{resource.description}</p>
                </div>
              </div>
            ))}
            
            {getResources().length === 0 && (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-primary-coral">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="text-primary-cream font-bold mb-1">Support WhatsApp hebdomadaire</h4>
                    <p className="text-primary-cream/70 text-sm">Posez une question, recevez une réponse audio personnalisée</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-primary-coral">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="text-primary-cream font-bold mb-1">Accès à la plateforme</h4>
                    <p className="text-primary-cream/70 text-sm">Ressources exclusives et exercices pour votre relation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-primary-coral">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h4 className="text-primary-cream font-bold mb-1">Investissement dans l'amour</h4>
                    <p className="text-primary-cream/70 text-sm">Transformez votre relation et construisez une connexion durable</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Target audience */}
        <div className="bg-primary-forest/30 rounded-[24px] p-6">
          <div className="flex items-start gap-4">
            <div className="text-primary-coral mt-1">
              <Users size={24} />
            </div>
            <div>
              <h4 className="text-primary-cream font-bold mb-2">Idéal pour</h4>
              <p className="text-primary-cream/90">
                {therapy.mainOffering && therapy.mainOffering.idealFor || 
                (therapy.id === 'couple' 
                  ? "Les couples en désir d'harmonie, qui ont le désir de mieux s'entendre et de mieux se comprendre."
                  : "Celles et ceux qui aspirent à une compréhension authentique d'eux-mêmes et à un alignement véritable.")}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {onShowPromo ? (
          <button
            onClick={handleClick}
            className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-[24px] py-3 font-bold flex items-center justify-center"
          >
            <span>En savoir plus</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        ) : (
          <Link href={`/therapies/${therapy.id}`} className="block">
            <button
              className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-[24px] py-3 font-bold flex items-center justify-center"
            >
              <span>En savoir plus</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
