'use client'

import { BookOpen, Calendar, Heart, MessageSquare, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import {
  BaseOffering,
  CoachingType,
  TherapyType,
} from '@/data/therapyOfferings/types'

interface TherapyCardProps {
  therapy: BaseOffering
  index: number
  onShowPromo: (therapyId: string) => void
  commonBenefits?: string[]
}

export const TherapyCard: React.FC<TherapyCardProps> = ({
  therapy,
  index,
  onShowPromo,
  commonBenefits = [],
}) => {
  const [hasCoupon, setHasCoupon] = useState(false);

  // Check for coupon in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const coupon = url.searchParams.get('coupon');
    setHasCoupon(coupon === 'COEUR180');
  }, []);

  // Calculate discounted price (10% off)
  const calculateDiscountedPrice = (price: number) => {
    return Math.round(price * 0.9);
  };

  // Get price display
  const getPriceDisplay = () => {
    if ('price' in therapy.mainOffering) {
      const price = therapy.mainOffering.price;
      if (hasCoupon) {
        const discountedPrice = calculateDiscountedPrice(price);
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-primary-cream line-through">{price}€</span>
            <span className="text-primary-coral">{discountedPrice}€</span>
          </div>
        );
      }
      return `${price}€`;
    } else if (therapy.mainOffering.details?.price) {
      const price = therapy.mainOffering.details.price;
      if (hasCoupon) {
        const discountedPrice = calculateDiscountedPrice(price);
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-primary-cream line-through">{price}€</span>
            <span className="text-primary-coral">{discountedPrice}€</span>
          </div>
        );
      }
      return `${price}€`;
    } else if (therapy.pricing) {
      if (typeof therapy.pricing === 'object') {
        if (hasCoupon) {
          const discountedCouple = calculateDiscountedPrice(therapy.pricing.couple);
          const discountedIndividual = calculateDiscountedPrice(therapy.pricing.individual);
          return (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-primary-cream line-through">{therapy.pricing.couple}€</span>
                <span className="text-primary-coral">{discountedCouple}€</span>
                <span className="text-primary-cream/80">/couple</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-primary-cream line-through">{therapy.pricing.individual}€</span>
                <span className="text-primary-coral">{discountedIndividual}€</span>
                <span className="text-primary-cream/80">/individuel</span>
              </div>
            </div>
          );
        }
        return `${therapy.pricing.couple}€/couple · ${therapy.pricing.individual}€/individuel`;
      }
      const price = therapy.pricing;
      if (hasCoupon) {
        const discountedPrice = calculateDiscountedPrice(price);
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-primary-cream line-through">{price}€</span>
            <span className="text-primary-coral">{discountedPrice}€</span>
          </div>
        );
      }
      return `${price}€`;
    } else if (
      therapy.mainOffering.formulas &&
      therapy.mainOffering.formulas.length > 0
    ) {
      const minPrice = Math.min(
        ...therapy.mainOffering.formulas.map((f) => f.price),
      );
      if (hasCoupon) {
        const discountedPrice = calculateDiscountedPrice(minPrice);
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-primary-cream/80">à partir de</span> 
            <span className="text-primary-cream line-through">{minPrice}€</span>
            <span className="text-primary-coral">{discountedPrice}€</span>
          </div>
        );
      }
      return `à partir de ${minPrice}€`;
    } else {
      return 'Prix sur demande';
    }
  };

  // Get proverbs or other quotes based on offering type
  const getQuotes = () => {
    if ((therapy as TherapyType).proverbs) {
      return (therapy as TherapyType).proverbs
    } else if ((therapy as CoachingType).promises) {
      return (therapy as CoachingType).promises
    }
    return []
  }

  // Get price details text
  const getPriceDetails = () => {
    if (therapy.mainOffering.note) {
      return therapy.mainOffering.note
    } else if (therapy.mainOffering.details?.price) {
      return 'pour le programme complet'
    } else if (
      therapy.mainOffering.formulas &&
      therapy.mainOffering.formulas.length > 0 &&
      therapy.mainOffering.formulas[0].priceDetails
    ) {
      return therapy.mainOffering.formulas[0].priceDetails
    }
    return ''
  }

  // Get organization points
  const getOrganizationPoints = () => {
    if (therapy.id === 'individual') {
      return [
        'Définissez votre thème thérapeutique',
        'Check-list + notes préalables et objectifs - à faire',
      ]
    }

    return therapy.options && therapy.options.length > 0
      ? ['Option personnalisée', 'Objectifs prédéfinis']
      : ['Programme détaillé', 'Organisation flexible']
  }

  // Get unique benefits/features specific to this therapy
  const getUniqueBenefits = () => {
    if (Array.isArray(therapy.mainOffering.uniqueBenefits)) {
      return therapy.mainOffering.uniqueBenefits
    } else if (
      therapy.mainOffering.uniqueBenefits &&
      typeof therapy.mainOffering.uniqueBenefits === 'object' &&
      'list' in therapy.mainOffering.uniqueBenefits
    ) {
      return therapy.mainOffering.uniqueBenefits.list
    }
    return []
  }

  // Get common benefits from the top level
  const getCommonBenefits = () => {
    return commonBenefits || []
  }

  // If commonBenefits prop is empty, use these defaults
  const getDefaultCommonBenefits = () => {
    return [
      'SMS WhatsApp chaque semaine : Vous posez une question, vous obtenez une réponse audio personnalisée.',
      'Accès gratuit à la plateforme pendant 2 ans : Accédez à des ressources exclusives et des événements en ligne pour soutenir votre transformation.',
      "Délocalisation des thérapies : Profitez de l'accompagnement, peu importe où vous vous trouvez, avec des sessions délocalisées accessibles partout",
    ]
  }

  // Get all formulas if available
  const getFormulas = () => {
    if (
      therapy.mainOffering.formulas &&
      therapy.mainOffering.formulas.length > 0
    ) {
      return therapy.mainOffering.formulas
    }
    return []
  }

  // Get all options if available
  const getOptions = () => {
    if (therapy.options && therapy.options.length > 0) {
      return therapy.options
    }
    return []
  }

  // Get quote or proverb
  const getQuote = () => {
    const quotes = getQuotes()
    if (quotes && quotes.length > 0) {
      return quotes[0]
    }
    // Fallback to mainOffering.quote if available
    if (therapy.mainOffering.quote) {
      return therapy.mainOffering.quote
    }
    return ''
  }

  // Get subtitle (either from therapy subtitle or category)
  const getSubtitle = () => {
    if (therapy.subtitle) {
      return therapy.subtitle
    } else if (therapy.category) {
      return therapy.category
    }
    return ''
  }

  // Get therapy or coaching type label
  const getTypeLabel = () => {
    return therapy.type === 'coaching' ? 'COACHING' : 'THÉRAPIE'
  }

  // Get organization sections
  const organizationPoints = getOrganizationPoints()
  const benefits = getUniqueBenefits()
  const commonBenefitsArray =
    commonBenefits.length > 0 ? commonBenefits : getDefaultCommonBenefits()

  // Get resources/inclusions
  const getResources = () => {
    const mainOfferingInclusions =
      therapy.mainOffering.details?.inclusions || []
    return mainOfferingInclusions
  }

  // Get appropriate icon for different benefit types
  const getBenefitIcon = (benefit: string) => {
    const lowerBenefit = benefit.toLowerCase()
    if (
      lowerBenefit.includes('whatsapp') ||
      lowerBenefit.includes('support') ||
      lowerBenefit.includes('message')
    ) {
      return <MessageSquare size={24} />
    } else if (
      lowerBenefit.includes('plateforme') ||
      lowerBenefit.includes('ressource') ||
      lowerBenefit.includes('accès')
    ) {
      return <BookOpen size={24} />
    } else if (
      lowerBenefit.includes('amour') ||
      lowerBenefit.includes('relation') ||
      lowerBenefit.includes('couple')
    ) {
      return <Heart size={24} />
    } else {
      return <Calendar size={24} />
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-primary-forest/30 p-8 hover:bg-primary-forest/40 transition-colors">
      <div className="space-y-12">
        {/* Title and Subtitle */}
        <div className="text-right">
          <div
            className="inline-block bg-primary-teal/20 text-primary-cream px-3 py-1 md:px-4 md:py-2 rounded-[24px] text-xs md:text-sm mb-4"
            role="presentation"
            aria-label={getTypeLabel()}
          >
            {getTypeLabel()}
          </div>
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

        {/* Organization for therapy offers OR Promises for coaching offers */}
        {therapy.type === 'coaching' ? (
          <div className="space-y-6">
            <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-4">
              <p className="text-primary-cream/90 mb-2">
                <strong>Promesses</strong>
              </p>
              <ul className="text-sm text-primary-cream/80 space-y-2 list-none m-0 p-0">
                {((therapy as CoachingType).mainOffering.promises || []).map(
                  (promise, idx) => (
                    <li key={idx} className="flex items-start gap-2 m-0">
                      <span className="text-primary-coral mt-1 flex-shrink-0">
                        ✓
                      </span>
                      <span>{promise}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        ) : (
          organizationPoints.length > 0 && (
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
          )
        )}

        {/* Price Section */}
        <div className="bg-primary-forest/30 rounded-[24px] p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl text-primary-coral font-light text-left">
              {therapy.mainOffering.details?.title ||
                `NOTRE OFFRE`}
            </h3>

            {/* Main offering price */}
            {('price' in therapy.mainOffering ||
              therapy.mainOffering.details?.price) && (
              <div className="flex flex-col gap-1">
                <div className="flex items-end gap-1 justify-start">
                  {typeof getPriceDisplay() === 'string' ? (
                    <p className="text-4xl text-primary-cream font-light">
                      {getPriceDisplay()}
                    </p>
                  ) : (
                    <div className="text-4xl font-light">
                      {getPriceDisplay()}
                    </div>
                  )}
                  <p className="text-primary-cream/70 pb-1">
                    {getPriceDetails()}
                  </p>
                </div>
                {therapy.type === 'coaching' &&
                  therapy.mainOffering.details && (
                    <div className="flex flex-col text-primary-cream/90 text-sm mt-1">
                      {therapy.mainOffering.details.duration && (
                        <p>{therapy.mainOffering.details.duration}</p>
                      )}
                      {therapy.mainOffering.details.sessionLength && (
                        <p className="text-primary-cream/80 text-sm">{therapy.mainOffering.details.sessionLength}</p>
                      )}
                    </div>
                  )}
              </div>
            )}

            {/* Pricing for VIT à la carte */}
            {therapy.pricing && typeof therapy.pricing === 'object' && (
              <div className="space-y-1 mt-2 text-right">
                <p className="text-base text-primary-cream font-light">
                  Prix à la séance:
                </p>
                {hasCoupon ? (
                  <>
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-sm text-primary-cream/90 line-through">
                        Couple: {therapy.pricing.couple}€
                      </p>
                      <p className="text-sm text-primary-coral">
                        {calculateDiscountedPrice(therapy.pricing.couple)}€
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-sm text-primary-cream/90 line-through">
                        Individuel: {therapy.pricing.individual}€
                      </p>
                      <p className="text-sm text-primary-coral">
                        {calculateDiscountedPrice(therapy.pricing.individual)}€
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-primary-cream/90">
                      Couple: {therapy.pricing.couple}€
                    </p>
                    <p className="text-sm text-primary-cream/90">
                      Individuel: {therapy.pricing.individual}€
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Formulas if available */}
            {getFormulas().length > 0 && (
              <div className="space-y-3 mt-3">
                {getFormulas().length > 1 && (
                  <p className="text-xl text-primary-cream font-light">
                    Formules disponibles:
                  </p>
                )}
                {getFormulas().map((formula, idx) => (
                  <div
                    key={idx}
                    className="bg-primary-dark/30 p-3 rounded-[16px]"
                  >
                    {getFormulas().length > 1 && (
                      <>
                        <div className="text-primary-cream font-bold">
                          <h4 className="font-bold">{formula.title}</h4>
                        </div>
                        {hasCoupon ? (
                          <div className="flex items-center gap-2">
                            <p className="text-primary-cream line-through">{formula.price}€</p>
                            <p className="text-primary-coral">{calculateDiscountedPrice(formula.price)}€</p>
                          </div>
                        ) : (
                          <p className="text-primary-cream">{formula.price}€</p>
                        )}
                      </>
                    )}
                    
                    {getFormulas().length === 1 && (
                      <div className="space-y-1">
                        {formula.duration && (
                          <p className="text-primary-cream">{formula.duration}</p>
                        )}
                        {/* @ts-ignore - Some coaching formulas have sessionLength property */}
                        {formula.sessionLength && (
                          <p className="text-primary-cream/80 text-sm">{formula.sessionLength}</p>
                        )}
                      </div>
                    )}
                    
                    {getFormulas().length > 1 && (
                      <>
                        {formula.priceDetails && (
                          <p className="text-primary-cream/70 text-sm">
                            {formula.priceDetails}
                          </p>
                        )}
                        {formula.duration && (
                          <p className="text-primary-cream/70 text-sm">
                            {formula.duration}
                          </p>
                        )}
                        {/* @ts-ignore - Some coaching formulas have sessionLength property */}
                        {formula.sessionLength && (
                          <p className="text-primary-cream/70 text-sm">
                            {formula.sessionLength}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Inclusions list */}
            {getResources().length > 0 && (
              <>
                <p className="text-lg text-primary-cream font-light mt-2">
                  Inclus:
                </p>
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
            <h3 className="text-xl text-primary-coral font-light">
              Options disponibles:
            </h3>
            {getOptions().map((option, idx) => (
              <div
                key={idx}
                className="bg-primary-dark/30 backdrop-blur-sm rounded-[16px] p-4"
              >
                <p className="text-primary-cream font-bold mb-2">
                  {option.title}
                </p>
                {option.pricing && typeof option.pricing === 'object' && (
                  <div className="text-primary-cream text-sm space-y-1">
                    {option.pricing.couple && (
                      <p>
                        Couple: {hasCoupon ? (
                          <span>
                            <span className="line-through">{option.pricing.couple.price}€</span>
                            {' '}
                            <span className="text-primary-coral">{calculateDiscountedPrice(option.pricing.couple.price)}€</span>
                          </span>
                        ) : option.pricing.couple.price}€/
                        {option.pricing.couple.duration || 'séance'}
                      </p>
                    )}
                    {option.pricing.individual && (
                      <p>
                        Individuel: {hasCoupon ? (
                          <span>
                            <span className="line-through">{option.pricing.individual.price}€</span>
                            {' '}
                            <span className="text-primary-coral">{calculateDiscountedPrice(option.pricing.individual.price)}€</span>
                          </span>
                        ) : option.pricing.individual.price}€/
                        {option.pricing.individual.duration || 'séance'}
                      </p>
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
            <h3 className="text-xl text-primary-coral font-light mb-4">
              Avantages Uniques:
            </h3>
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
      
      {/* Coupon notification */}
      {hasCoupon && (
        <div className="absolute top-3 right-3 bg-primary-coral px-3 py-1 rounded-full text-xs text-primary-cream">
          Code promo COEUR180 (-10%) appliqué !
        </div>
      )}
    </div>
  )
}
