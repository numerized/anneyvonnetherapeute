"use client";

import React from 'react';
import { TherapyGrid } from './TherapyGrid';
import { getTherapyOfferings, getAllTherapyTypes } from '@/data/therapyOfferings/utils';

interface TherapyOfferingsPageProps {
  displayAll?: boolean;
  displayIds?: string[];
}

const TherapyOfferingsPage: React.FC<TherapyOfferingsPageProps> = ({
  displayAll = true,
  displayIds = []
}) => {
  const offerings = getTherapyOfferings();
  const therapyTypes = getAllTherapyTypes();
  
  return (
    <main className="bg-[#2D3E3C] min-h-screen text-[#E9B49F]">
      {/* Hero Section */}
      <section className="bg-[#2D3E3C] py-16 border-b border-[#E9B49F]/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-[#E9B49F] mb-6">{offerings.title}</h1>
          <p className="text-lg text-primary-cream/90 max-w-3xl mx-auto">
            {therapyTypes.length > 0 && therapyTypes[0].description}
          </p>
        </div>
      </section>
      
      {/* Therapy Offerings Grid */}
      <TherapyGrid 
        therapies={therapyTypes} 
        displayAll={displayAll}
        displayIds={displayIds}
        title="NOS THÉRAPIES"
        subtitle={offerings.title}
        className="bg-[#2D3E3C]"
      />
      
      {/* Testimonial Section */}
      <section className="bg-[#2D3E3C] py-16 border-t border-b border-[#E9B49F]/10">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="max-w-3xl mx-auto">
            <p className="text-xl italic text-primary-cream mb-6">
              {therapyTypes.length > 0 && therapyTypes[0].mainOffering.motto}
            </p>
            <footer className="text-primary-cream/70">
              — Anne Yvonne
            </footer>
          </blockquote>
        </div>
      </section>
      
      {/* Recommendations Section */}
      <section className="py-16 bg-[#2D3E3C]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-[#2D3E3C] border border-[#E9B49F]/30 text-[#E9B49F] px-4 py-2 rounded-[24px] text-sm mb-4">
              Nos recommandations pour vous
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-[#E9B49F]">
              {therapyTypes.length > 0 && therapyTypes[0].mainOffering.tagline}
            </h2>
            <p className="text-primary-cream/80 max-w-3xl mx-auto">
              {therapyTypes.length > 0 && therapyTypes[0].headline}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {therapyTypes.slice(0, 2).map((therapy, index) => (
              <div key={therapy.id} className="bg-[#2D3E3C] p-8 rounded-[24px] border border-[#E9B49F]/20 hover:border-[#E9B49F]/30 transition-colors">
                <h3 className="text-xl font-medium mb-3 text-[#E9B49F]">{therapy.title}</h3>
                <p className="text-primary-cream/90 mb-4">{therapy.subtitle}</p>
                
                {/* Quotation */}
                <div className="mb-6 border-l-2 border-[#E9B49F] pl-4 italic">
                  <p className="text-primary-cream/90">
                    {therapy.proverbs && therapy.proverbs.length > 0 ? therapy.proverbs[0] : ""}
                  </p>
                </div>
                
                {/* Organization Details */}
                <div className="mb-6">
                  <h4 className="text-[#E9B49F] mb-2">Organisation</h4>
                  <ul className="space-y-2">
                    {therapy.id === 'couple' && therapy.mainOffering.details ? (
                      <>
                        <li className="text-primary-cream/90">{therapy.mainOffering.details.sessionLength}</li>
                        <li className="text-primary-cream/90">{therapy.mainOffering.process?.details[0]}</li>
                      </>
                    ) : therapy.id === 'individual' && therapy.mainOffering.formulas ? (
                      therapy.mainOffering.formulas.slice(0, 2).map((formula, i) => (
                        <li key={i} className="text-primary-cream/90">
                          {formula.duration}
                        </li>
                      ))
                    ) : null}
                  </ul>
                </div>
                
                {/* Benefits */}
                {therapy.mainOffering.benefits && Array.isArray(therapy.mainOffering.benefits) && (
                  <div className="mb-6">
                    <ul className="space-y-4">
                      {(therapy.mainOffering.benefits as string[]).slice(0, 3).map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-[#E9B49F] mr-2 mt-1">•</span>
                          <span className="text-primary-cream/90">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Price */}
                {therapy.id === 'couple' && therapy.mainOffering.details ? (
                  <div className="mt-8 text-right">
                    <h3 className="text-xl text-[#E9B49F] mb-2">
                      {therapy.mainOffering.details.title}
                    </h3>
                    <div className="text-3xl font-bold text-[#E9B49F]">
                      {therapy.mainOffering.details.price} €
                    </div>
                  </div>
                ) : therapy.id === 'individual' && therapy.mainOffering.formulas ? (
                  <div className="mt-8 text-right">
                    <h3 className="text-xl text-[#E9B49F] mb-2">
                      {therapy.mainOffering.formulas[0].title}
                    </h3>
                    <div className="text-3xl font-bold text-[#E9B49F]">
                      {therapy.mainOffering.formulas[0].price} €
                    </div>
                  </div>
                ) : null}
                
                {/* CTA Button */}
                <div className="mt-6 text-center">
                  <button className="bg-[#E9B49F] text-[#2D3E3C] px-8 py-3 rounded-full hover:bg-[#E9B49F]/90 transition-colors">
                    En savoir plus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default TherapyOfferingsPage;
