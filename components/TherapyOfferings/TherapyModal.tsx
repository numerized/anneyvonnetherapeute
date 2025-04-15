'use client'

import { ChevronDown, ChevronUp, X } from 'lucide-react'
import React from 'react'

import { TherapyType } from '@/data/therapyOfferings/types'
import { getTherapyTypeById } from '@/data/therapyOfferings/utils'

interface TherapyModalProps {
  isOpen: boolean
  onClose: () => void
  therapyId: string
}

export const TherapyModal: React.FC<TherapyModalProps> = ({
  isOpen,
  onClose,
  therapyId,
}) => {
  const therapy = getTherapyTypeById(therapyId)

  if (!isOpen || !therapy) return null

  // Helper function to determine if the therapy has options
  const hasOptions = 
    ('modalInfo' in therapy && therapy.modalInfo?.options && therapy.modalInfo.options.length > 0) || 
    (therapy.options && therapy.options.length > 0)

  // Helper function to determine if the therapy has formulas
  const hasFormulas =
    ('modalInfo' in therapy && therapy.modalInfo?.formulas && therapy.modalInfo.formulas.length > 0) ||
    (therapy.mainOffering.formulas && therapy.mainOffering.formulas.length > 0)

  // Helper function to render proverbs section
  const renderProverbs = () => {
    const proverbs = ('modalInfo' in therapy && therapy.modalInfo?.proverbs) 
      ? therapy.modalInfo.proverbs 
      : therapy.proverbs

    if (!proverbs || proverbs.length === 0) return null

    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">Sagesse</h3>
        <div className="space-y-4">
          {proverbs.map((proverb, index) => (
            <blockquote
              key={index}
              className="border-l-4 border-primary-coral pl-4 italic text-primary-cream/90"
            >
              "{proverb}"
            </blockquote>
          ))}
        </div>
      </div>
    )
  }

  // Helper function to render themes section
  const renderThemes = () => {
    const themes = ('modalInfo' in therapy && therapy.modalInfo?.themes) 
      ? therapy.modalInfo.themes 
      : therapy.themes

    if (!themes || themes.length === 0) return null

    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">
          Thèmes abordés
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme, index) => (
            <div
              key={index}
              className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]"
            >
              <h4 className="font-bold text-primary-cream mb-2">
                {theme.title}
              </h4>
              <p className="text-primary-cream/80">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Helper function to render process section
  const renderProcess = () => {
    const process = ('modalInfo' in therapy && therapy.modalInfo?.process) 
      ? therapy.modalInfo.process 
      : therapy.mainOffering.process

    if (!process) return null

    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">
          {process.title || 'Processus'}
        </h3>
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          <ul className="space-y-3">
            {process.details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-coral mr-2 mt-1">♦</span>
                <span className="text-primary-cream/90">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // Helper function to render benefits section
  const renderBenefits = () => {
    // First try to get benefits from modalInfo 
    if ('modalInfo' in therapy && therapy.modalInfo) {
      // Check for modalBenefits in modalInfo
      if (therapy.modalInfo.modalBenefits && therapy.modalInfo.modalBenefits.length > 0) {
        return (
          <div className="space-y-8 mt-12">
            <h3 className="text-primary-cream text-xl font-bold">
              Avantages Uniques
            </h3>
            <div className="space-y-6">
              {therapy.modalInfo.modalBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-primary-coral mt-1">
                    ♦
                  </div>
                  <div className="text-primary-cream/90">{benefit}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // Add additionalBenefits if they exist
      if (therapy.modalInfo.additionalBenefits && therapy.modalInfo.additionalBenefits.length > 0) {
        return (
          <div className="space-y-8 mt-12">
            <h3 className="text-primary-cream text-xl font-bold">
              Avantages Supplémentaires
            </h3>
            <div className="space-y-6">
              {therapy.modalInfo.additionalBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-primary-coral mt-1">
                    ♦
                  </div>
                  <div className="text-primary-cream/90">{benefit}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    }

    // Fall back to mainOffering benefits if no modalInfo benefits found
    const benefits = therapy.mainOffering.uniqueBenefits;

    if (!benefits) return null

    if (Array.isArray(benefits)) {
      return (
        <div className="space-y-8 mt-12">
          <h3 className="text-primary-cream text-xl font-bold">
            Avantages Uniques
          </h3>
          <div className="space-y-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="text-primary-coral mt-1">
                  ♦
                </div>
                <div className="text-primary-cream/90">{benefit}</div>
              </div>
            ))}
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-8 mt-12">
          <h3 className="text-primary-cream text-xl font-bold">
            {benefits.title}
          </h3>
          {benefits.intro && (
            <p className="text-primary-cream/70">
              {benefits.intro}
            </p>
          )}
          <div className="space-y-6">
            {benefits.list.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="text-primary-coral mt-1">
                  ♦
                </div>
                <div className="text-primary-cream/90">{benefit}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  // Helper function to render main offering details
  const renderMainOfferingDetails = () => {
    // Check modalInfo formulas first
    if ('modalInfo' in therapy && 
        therapy.modalInfo?.formulas && 
        therapy.modalInfo.formulas.length > 0) {
      
      // Use the first formula for main details
      const firstFormula = therapy.modalInfo.formulas[0];
      
      return (
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 text-primary-coral">
            Détails de l'offre
          </h3>
          <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
            <div className="mb-4">
              <span className="text-primary-coral">Durée : </span>
              <span className="text-primary-cream/90">{firstFormula.duration}</span>
            </div>
            <div className="mb-4">
              <span className="text-primary-coral">Prix : </span>
              <span className="text-primary-cream/90">{firstFormula.price}€ {firstFormula.priceDetails || ''}</span>
            </div>
            {firstFormula.inclusions && firstFormula.inclusions.length > 0 && (
              <div>
                <span className="text-primary-coral block mb-2">Inclus : </span>
                <ul className="list-disc list-inside space-y-2 text-primary-cream/90">
                  {firstFormula.inclusions.map((inclusion, idx) => (
                    <li key={idx}>{inclusion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Fall back to mainOffering details
    const details = therapy.mainOffering.details;
    if (!details) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-primary-coral">
          Détails de l'offre
        </h3>
        <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
          <div className="mb-4">
            <span className="text-primary-coral">Durée : </span>
            <span className="text-primary-cream/90">{details.duration}</span>
          </div>
          <div className="mb-4">
            <span className="text-primary-coral">Planning : </span>
            <span className="text-primary-cream/90">{details.schedule}</span>
          </div>
          <div className="mb-4">
            <span className="text-primary-coral">Durée de séance : </span>
            <span className="text-primary-cream/90">{details.sessionLength}</span>
          </div>
          <div className="mb-4">
            <span className="text-primary-coral">Prix : </span>
            <span className="text-primary-cream/90">{details.price}€</span>
          </div>
          {details.inclusions && (
            <div>
              <span className="text-primary-coral block mb-2">Inclus : </span>
              <ul className="list-disc list-inside space-y-2 text-primary-cream/90">
                {details.inclusions.map((inclusion, idx) => (
                  <li key={idx}>{inclusion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Helper function to safely get price value
  const getPriceValue = (priceObj: any): number => {
    if (typeof priceObj === 'number') {
      return priceObj
    } else if (
      priceObj &&
      typeof priceObj === 'object' &&
      'price' in priceObj
    ) {
      return priceObj.price
    }
    return 0
  }

  // Helper function to format pricing display with details
  const formatPriceDisplay = (
    price: number,
    note?: string,
    priceDetails?: string,
  ) => {
    let priceText = `${price}€`

    if (note) {
      return `${priceText} (${note})`
    }

    if (priceDetails) {
      return `${priceText} ${priceDetails}`
    }

    return priceText
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="bg-primary-forest/90 backdrop-blur-sm rounded-[24px] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary-forest z-10 p-6 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl text-primary-coral font-light">
                {therapy.title}
              </h2>
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
                <h3 className="text-2xl font-medium text-primary-coral">
                  Options supplémentaires
                </h3>

                <div className="space-y-8">
                  {therapy.options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-primary-dark/30 backdrop-blur-sm p-6 rounded-[16px]"
                    >
                      <h4 className="text-xl font-bold text-primary-cream mb-4">
                        {option.title}
                      </h4>
                      <p className="text-primary-cream/80 mb-4">
                        {option.description}
                      </p>

                      {option.sections &&
                        option.sections.map((section, idx) => (
                          <div key={idx} className="mb-4">
                            <h5 className="text-lg font-medium text-primary-coral mb-2">
                              {section.title}
                            </h5>
                            {section.content && (
                              <p className="text-primary-cream/90 mb-2">
                                {section.content}
                              </p>
                            )}

                            {section.bulletPoints &&
                              section.bulletPoints.length > 0 && (
                                <ul className="space-y-1 ml-4">
                                  {section.bulletPoints.map(
                                    (point, bulletIdx) => (
                                      <li
                                        key={bulletIdx}
                                        className="text-primary-cream/80 flex items-start gap-2"
                                      >
                                        <span className="text-primary-coral">
                                          •
                                        </span>
                                        <span>{point}</span>
                                      </li>
                                    ),
                                  )}
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
                <h3 className="text-2xl font-medium text-primary-coral">
                  Formules disponibles
                </h3>

                <div className="space-y-6">
                  {therapy.mainOffering.formulas.map((formula) => (
                    <div
                      key={formula.id}
                      className="bg-primary-dark/30 backdrop-blur-sm rounded-[16px] p-6"
                    >
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-primary-cream">
                          {formula.title}
                        </h4>
                        {formula.price && (
                          <p className="text-primary-cream/70 text-lg font-light">
                            {formula.price}€
                          </p>
                        )}
                      </div>

                      <div>
                        {formula.priceDetails && (
                          <div className="mb-4">
                            <h5 className="text-lg font-medium text-primary-coral mb-1">
                              Détails du prix
                            </h5>
                            <p className="text-primary-cream">
                              {formula.priceDetails}
                            </p>
                          </div>
                        )}

                        {formula.duration && (
                          <div className="mb-4">
                            <h5 className="text-lg font-medium text-primary-coral mb-1">
                              Durée
                            </h5>
                            <p className="text-primary-cream">
                              {formula.duration}
                            </p>
                          </div>
                        )}

                        {formula.note && (
                          <div className="mb-4">
                            <h5 className="text-lg font-medium text-primary-coral mb-1">
                              Note
                            </h5>
                            <p className="text-primary-cream">{formula.note}</p>
                          </div>
                        )}

                        {formula.features && formula.features.length > 0 && (
                          <div>
                            <h5 className="text-lg font-medium text-primary-coral mb-2">
                              Caractéristiques
                            </h5>
                            <ul className="space-y-1">
                              {formula.features.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="text-primary-cream/80 flex items-start gap-2"
                                >
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
  )
}
