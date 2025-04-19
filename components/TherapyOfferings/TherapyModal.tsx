'use client'

import { ChevronDown, ChevronUp, X } from 'lucide-react'
import React from 'react'

import { TherapyType } from '@/data/therapyOfferings/types'
import { getTherapyTypeById } from '@/data/therapyOfferings/utils'

import offeringsData from '../../data/therapyOfferings/offerings.json'

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

  // Check if we have a specialized moreInfos content structure
  const hasMoreInfos =
    'modalInfo' in therapy && therapy.modalInfo?.moreInfos !== undefined

  // Helper function to determine if the therapy has options
  const hasOptions =
    ('modalInfo' in therapy &&
      therapy.modalInfo?.options &&
      therapy.modalInfo.options.length > 0) ||
    (therapy.options && therapy.options.length > 0)

  // Helper function to determine if the therapy has formulas
  const hasFormulas =
    ('modalInfo' in therapy &&
      therapy.modalInfo?.formulas &&
      therapy.modalInfo.formulas.length > 0) ||
    (therapy.mainOffering?.formulas && therapy.mainOffering.formulas.length > 0)

  // Helper function to render specialized More Infos content
  const renderMoreInfos = () => {
    if (!hasMoreInfos || !therapy.modalInfo?.moreInfos) return null

    const moreInfos = therapy.modalInfo.moreInfos

    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="mb-8">
          {moreInfos.headline && (
            <h3 className="text-xl text-primary-coral mb-4">
              {moreInfos.headline}
            </h3>
          )}
          {moreInfos.description && (
            <p className="text-primary-cream/90">{moreInfos.description}</p>
          )}
        </div>

        {/* Sagesse / Quotes Section */}
        {moreInfos.sagesse &&
          moreInfos.sagesse.quotes &&
          moreInfos.sagesse.quotes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-primary-coral">
                {moreInfos.sagesse.title || 'Sagesse'}
              </h3>
              <div className="space-y-4">
                {moreInfos.sagesse.quotes.map((quote, index) => (
                  <blockquote
                    key={index}
                    className="border-l-4 border-primary-coral pl-4 italic text-primary-cream/90"
                  >
                    "{quote}"
                  </blockquote>
                ))}
              </div>
            </div>
          )}

        {/* Themes Section */}
        {moreInfos.themes &&
          moreInfos.themes.items &&
          moreInfos.themes.items.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-primary-coral">
                {moreInfos.themes.title || 'Thèmes abordés'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moreInfos.themes.items.map((theme, index) => (
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
          )}

        {/* Process Section */}
        {moreInfos.process &&
          moreInfos.process.details &&
          moreInfos.process.details.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-primary-coral">
                {moreInfos.process.title || 'Processus'}
              </h3>
              <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
                <ul className="space-y-3">
                  {moreInfos.process.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-coral mr-2 mt-1">♦</span>
                      <span className="text-primary-cream/90">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        {/* Common Benefits Section */}
        {renderCommonBenefits()}

        {/* Benefits Section */}
        {moreInfos.benefits &&
          moreInfos.benefits.items &&
          moreInfos.benefits.items.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4 text-primary-coral">
                {moreInfos.benefits.title || 'Avantages'}
              </h3>
              <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
                <ul className="space-y-3">
                  {moreInfos.benefits.items.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-coral mr-2 mt-1">♦</span>
                      <span className="text-primary-cream/90">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        {/* Options Section */}
        {moreInfos.options && moreInfos.options.length > 0 && (
          <div className="space-y-8 mt-8">
            <h3 className="text-xl font-medium mb-4 text-primary-coral">
              Options supplémentaires
            </h3>
            <div className="space-y-8">
              {moreInfos.options.map((option, index) => (
                <div
                  key={index}
                  className="bg-primary-dark/30 backdrop-blur-sm p-6 rounded-[16px]"
                >
                  <h4 className="text-xl font-bold text-primary-cream mb-4">
                    {option.title}
                  </h4>
                  {option.headline && (
                    <p className="text-primary-cream/80 mb-4">
                      {option.headline}
                    </p>
                  )}

                  {option.sections &&
                    option.sections.map((section, idx) => (
                      <div key={idx} className="mb-4">
                        {section.title && (
                          <h5 className="text-lg font-medium text-primary-cream mb-2">
                            {section.title}
                          </h5>
                        )}
                        {section.content && (
                          <p className="text-primary-cream/90 mb-2">
                            {section.content}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulas Section */}
        {moreInfos.formulas && (
          <div className="space-y-8 mt-8">
            <h3 className="text-xl font-medium mb-4 text-primary-coral">
              Formules disponibles
            </h3>
            <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[16px] p-6">
              {/* Handle formulas as an object with details */}
              {!Array.isArray(moreInfos.formulas) &&
                moreInfos.formulas.price && (
                  <div className="text-primary-cream font-bold text-lg mb-4 text-right">
                    {moreInfos.formulas.price.split('pour')[0]}
                    <span className="text-sm text-primary-cream">
                      CHF / EUR
                    </span>
                    {moreInfos.formulas.price.includes('pour') && (
                      <div className="text-primary-cream/70 text-sm mt-1">
                        pour le programme complet
                      </div>
                    )}
                  </div>
                )}

              {/* Handle formulas as an object with details */}
              {!Array.isArray(moreInfos.formulas) &&
                moreInfos.formulas.details && (
                  <div className="space-y-4">
                    {moreInfos.formulas.details.title && (
                      <h4 className="text-lg font-medium text-primary-cream">
                        {moreInfos.formulas.details.title}
                      </h4>
                    )}
                    {moreInfos.formulas.details.duration && (
                      <p className="text-primary-cream/90">
                        {moreInfos.formulas.details.duration}
                      </p>
                    )}
                    {moreInfos.formulas.details.features && (
                      <p className="text-primary-cream/90">
                        {moreInfos.formulas.details.features}
                      </p>
                    )}
                  </div>
                )}

              {/* Handle formulas as an array */}
              {Array.isArray(moreInfos.formulas) && (
                <div className="space-y-6">
                  {moreInfos.formulas.map((formula, index) => (
                    <div
                      key={index}
                      className="border-b border-primary-cream/20 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                    >
                      <h4 className="text-lg font-bold text-primary-cream mb-2">
                        {formula.title}
                      </h4>
                      <div className="space-y-2">
                        {formula.price && (
                          <p className="text-primary-cream/90 text-right">
                            <span className="text-primary-coral">Prix:</span>{' '}
                            {formatPrice(formula.price)}
                          </p>
                        )}
                        {formula.duration && (
                          <p className="text-primary-cream/90">
                            <span className="text-primary-coral">Durée:</span>{' '}
                            {formula.duration}
                          </p>
                        )}
                        {formula.details && (
                          <p className="text-primary-cream/90">
                            <span className="text-primary-coral">
                              Caractéristiques:
                            </span>{' '}
                            {formula.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Helper function to render proverbs section
  const renderProverbs = () => {
    const proverbs =
      'modalInfo' in therapy && therapy.modalInfo?.proverbs
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
    const themes =
      'modalInfo' in therapy && therapy.modalInfo?.themes
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
    const process =
      'modalInfo' in therapy && therapy.modalInfo?.process
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

  // Helper function to render common benefits
  const renderCommonBenefits = () => {
    // Use the imported offerings data
    const commonBenefitsFromData = offeringsData.commonBenefits

    if (commonBenefitsFromData && commonBenefitsFromData.length > 0) {
      return (
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 text-primary-coral">
            Avantages Communs à Toutes les Offres
          </h3>
          <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
            <ul className="space-y-3">
              {commonBenefitsFromData.map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-primary-coral mr-2 mt-1">♦</span>
                  <span className="text-primary-cream/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    return null
  }

  // Helper function to render benefits content structure
  const renderBenefitsContent = (benefits: any) => {
    if (Array.isArray(benefits)) {
      return (
        <div className="space-y-8 mt-12">
          <h3 className="text-xl font-medium mb-4 text-primary-coral">
            Avantages
          </h3>
          <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
            <ul className="space-y-3">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-primary-coral mr-2 mt-1">♦</span>
                  <span className="text-primary-cream/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    } else {
      return (
        <div className="space-y-8 mt-12">
          <h3 className="text-xl font-medium mb-4 text-primary-coral">
            {benefits.title}
          </h3>
          {benefits.intro && (
            <p className="text-primary-cream/70 mb-4">{benefits.intro}</p>
          )}
          <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
            <ul className="space-y-3">
              {benefits.list.map((benefit, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-primary-coral mr-2 mt-1">♦</span>
                  <span className="text-primary-cream/90">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
  }

  // Helper function to render benefits section
  const renderBenefits = () => {
    // First try to get benefits from modalInfo
    if ('modalInfo' in therapy && therapy.modalInfo) {
      // Check for modalBenefits in modalInfo
      if (
        therapy.modalInfo.modalBenefits &&
        therapy.modalInfo.modalBenefits.length > 0
      ) {
        return renderBenefitsContent(therapy.modalInfo.modalBenefits)
      }

      // Add additionalBenefits if they exist
      if (
        therapy.modalInfo.additionalBenefits &&
        therapy.modalInfo.additionalBenefits.length > 0
      ) {
        return renderBenefitsContent(therapy.modalInfo.additionalBenefits)
      }
    }

    // Fall back to mainOffering benefits if no modalInfo benefits found
    const benefits = therapy.mainOffering.uniqueBenefits

    if (!benefits) return null

    return renderBenefitsContent(benefits)
  }

  // Helper function to render main offering details
  const renderMainOfferingDetails = () => {
    // Check modalInfo formulas first
    if (
      'modalInfo' in therapy &&
      therapy.modalInfo?.formulas &&
      therapy.modalInfo.formulas.length > 0
    ) {
      // Use the first formula for main details
      const firstFormula = therapy.modalInfo.formulas[0]

      return (
        <div className="mb-8">
          <h3 className="text-xl font-medium mb-4 text-primary-coral">
            Détails de l'offre
          </h3>
          <div className="bg-primary-dark/30 backdrop-blur-sm p-4 rounded-[16px]">
            <div className="mb-4">
              <span className="text-primary-coral">Durée : </span>
              <span className="text-primary-cream/90">
                {firstFormula.duration}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-primary-coral">Prix : </span>
              <span className="text-primary-cream text-right">
                {firstFormula.price}{' '}
                <span className="text-sm text-primary-cream">CHF / EUR</span>
                {firstFormula.priceDetails && (
                  <div className="text-primary-cream/70 text-sm mt-1">
                    {firstFormula.priceDetails}
                  </div>
                )}
              </span>
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
      )
    }

    // Fall back to mainOffering details
    const details = therapy.mainOffering.details
    if (!details) return null

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
            <span className="text-primary-cream/90">
              {details.sessionLength}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-primary-coral">Prix : </span>
            <span className="text-primary-cream text-right">
              {formatPrice(details.price)}{' '}
            </span>
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
  const formatPrice = (
    price: number | string | undefined,
    note?: string,
    priceDetails?: string,
  ) => {
    if (!price) return null

    return (
      <span className="text-primary-cream text-right inline-block">
        <span className="block">
          {price} <span className="text-sm text-primary-cream">CHF / EUR</span>
        </span>
        {note && (
          <span className="text-primary-cream/70 text-sm mt-1 block">
            ({note})
          </span>
        )}
        {priceDetails && (
          <span className="text-primary-cream/70 text-sm mt-1 block">
            {priceDetails}
          </span>
        )}
      </span>
    )
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
            {hasMoreInfos ? (
              renderMoreInfos()
            ) : (
              <>
                {renderProverbs()}
                {renderThemes()}
                {renderProcess()}
                {renderCommonBenefits()}
                {renderBenefits()}

                {/* Options section if available */}
                {hasOptions && therapy.options && (
                  <div className="space-y-8 mt-8">
                    <h3 className="text-xl font-medium text-primary-coral">
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
                                {section.title && (
                                  <h5 className="text-lg font-medium text-primary-cream mb-2">
                                    {section.title}
                                  </h5>
                                )}
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
                {hasFormulas && therapy.mainOffering?.formulas && (
                  <div className="space-y-8 mt-8">
                    <h3 className="text-xl font-medium mb-4 text-primary-coral">
                      Formules disponibles
                    </h3>

                    <div className="space-y-6">
                      {therapy.mainOffering.formulas.map((formula) => (
                        <div
                          key={formula.id}
                          className="bg-primary-dark/30 backdrop-blur-sm rounded-[16px] p-6"
                        >
                          <div className="mb-4">
                            <h4 className="text-lg font-bold text-primary-cream">
                              {formula.title}
                            </h4>
                            {formula.price && (
                              <div className="text-primary-cream text-lg font-light text-right">
                                {formula.price}{' '}
                                <span className="text-sm text-primary-cream">
                                  CHF / EUR
                                </span>
                                {formula.priceDetails && (
                                  <div className="text-primary-cream/70 text-sm mt-1">
                                    {formula.priceDetails}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div>
                            {formula.priceDetails && (
                              <div className="mb-4">
                                <h5 className="text-lg font-medium text-primary-cream mb-1">
                                  Détails du prix
                                </h5>
                                <p className="text-primary-cream">
                                  {formula.priceDetails}
                                </p>
                              </div>
                            )}

                            {formula.duration && (
                              <div className="mb-4">
                                <h5 className="text-lg font-medium text-primary-cream mb-1">
                                  Durée et format
                                </h5>
                                <p className="text-primary-cream">
                                  {formula.duration}
                                </p>
                              </div>
                            )}

                            {formula.note && (
                              <div className="mb-4">
                                <h5 className="text-lg font-medium text-primary-cream mb-1">
                                  Note
                                </h5>
                                <p className="text-primary-cream">
                                  {formula.note}
                                </p>
                              </div>
                            )}

                            {formula.features &&
                              formula.features.length > 0 && (
                                <div>
                                  <h5 className="text-lg font-medium text-primary-cream mb-2">
                                    Caractéristiques
                                  </h5>
                                  <ul className="space-y-1">
                                    {formula.features.map((feature, idx) => (
                                      <li
                                        key={idx}
                                        className="text-primary-cream/80 flex items-start gap-2"
                                      >
                                        <span className="text-primary-coral">
                                          ✓
                                        </span>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
