'use client'

import { Heart, MessageSquare, Calendar, FileText } from 'lucide-react'

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-primary-dark p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-primary-cream font-light mb-4">
            Style Guide
          </h1>
          <p className="text-primary-cream/80 text-xl">
            Guide complet des éléments de design et composants
          </p>
        </div>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-3xl text-primary-cream font-light mb-8">Typography</h2>
          
          <div className="space-y-8 bg-primary-forest/30 p-8 rounded-[24px]">
            <div>
              <h1 className="text-6xl text-primary-cream">Heading 1 (text-6xl)</h1>
              <h2 className="text-5xl text-primary-cream font-light">Heading 2 (text-5xl)</h2>
              <h3 className="text-4xl text-primary-cream font-light">Heading 3 (text-4xl)</h3>
              <h4 className="text-3xl text-primary-cream font-light">Heading 4 (text-3xl)</h4>
              <h5 className="text-2xl text-primary-cream font-light">Heading 5 (text-2xl)</h5>
              <h6 className="text-xl text-primary-cream font-light">Heading 6 (text-xl)</h6>
            </div>

            <div className="space-y-4">
              <p className="text-primary-cream/90 text-lg">
                Large paragraph text (text-lg) - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-primary-cream/80">
                Regular paragraph text (base) - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <p className="text-primary-cream/70 text-sm">
                Small text (text-sm) - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-light text-primary-cream">Font Weight Light (300)</p>
              <p className="font-normal text-primary-cream">Font Weight Normal (400)</p>
              <p className="font-medium text-primary-cream">Font Weight Medium (500)</p>
              <p className="font-semibold text-primary-cream">Font Weight Semibold (600)</p>
              <p className="font-bold text-primary-cream">Font Weight Bold (700)</p>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="mb-16">
          <h2 className="text-3xl text-primary-cream font-light mb-8">Colors</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="h-24 bg-primary-yellow rounded-[16px]"></div>
              <p className="text-primary-cream">primary-yellow (#D9B70D)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-brown rounded-[16px]"></div>
              <p className="text-primary-cream">primary-brown (#8B4513)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-rust rounded-[16px]"></div>
              <p className="text-primary-cream">primary-rust (#C1666D)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-coral rounded-[16px]"></div>
              <p className="text-primary-cream">primary-coral (#E8927C)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-cream rounded-[16px]"></div>
              <p className="text-primary-cream">primary-cream (#F7EDE2)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-dark rounded-[16px]"></div>
              <p className="text-primary-cream">primary-dark (#2A3A3A)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-forest rounded-[16px]"></div>
              <p className="text-primary-cream">primary-forest (#395756)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-teal rounded-[16px]"></div>
              <p className="text-primary-cream">primary-teal (#7BA7BC)</p>
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-primary-sky rounded-[16px]"></div>
              <p className="text-primary-cream">primary-sky (#89C5CC)</p>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section className="mb-16">
          <h2 className="text-3xl text-primary-cream font-light mb-8">Components</h2>
          
          <div className="space-y-12 bg-primary-forest/30 p-8 rounded-[24px]">
            {/* Buttons */}
            <div className="space-y-6">
              <h3 className="text-2xl text-primary-cream font-light mb-4">Buttons</h3>
              <div className="space-y-4">
                <button className="bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-8 py-3 rounded-[24px] font-bold">
                  Primary Button
                </button>
                <button className="bg-primary-teal hover:bg-primary-teal/80 transition-colors text-primary-cream px-8 py-3 rounded-[24px] font-bold ml-4">
                  Secondary Button
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
              <h3 className="text-2xl text-primary-cream font-light mb-4">Cards</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary-dark/30 backdrop-blur-sm rounded-[24px] p-6">
                  <h4 className="text-xl text-primary-cream font-light mb-4">Card Title</h4>
                  <p className="text-primary-cream/80">
                    Card content with backdrop blur effect.
                  </p>
                </div>
                <div className="bg-primary-forest/30 rounded-[24px] p-6">
                  <h4 className="text-xl text-primary-cream font-light mb-4">Card Title</h4>
                  <p className="text-primary-cream/80">
                    Card content with forest background.
                  </p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-6">
              <h3 className="text-2xl text-primary-cream font-light mb-4">Badges</h3>
              <div className="space-x-4">
                <span className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm">
                  Badge Primary
                </span>
                <span className="inline-block bg-primary-teal/20 text-primary-cream px-4 py-2 rounded-[24px] text-sm">
                  Badge Secondary
                </span>
              </div>
            </div>

            {/* Icons */}
            <div className="space-y-6">
              <h3 className="text-2xl text-primary-cream font-light mb-4">Icons</h3>
              <div className="flex space-x-6">
                <Heart className="text-primary-coral" size={24} />
                <MessageSquare className="text-primary-coral" size={24} />
                <Calendar className="text-primary-coral" size={24} />
                <FileText className="text-primary-coral" size={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Layout Section */}
        <section className="mb-16">
          <h2 className="text-3xl text-primary-cream font-light mb-8">Layout</h2>
          
          <div className="space-y-8">
            {/* Grid Example */}
            <div>
              <h3 className="text-2xl text-primary-cream font-light mb-4">Grid Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-primary-forest/30 p-4 rounded-[16px] text-primary-cream text-center">1</div>
                <div className="bg-primary-forest/30 p-4 rounded-[16px] text-primary-cream text-center">2</div>
                <div className="bg-primary-forest/30 p-4 rounded-[16px] text-primary-cream text-center">3</div>
              </div>
            </div>

            {/* Spacing Example */}
            <div>
              <h3 className="text-2xl text-primary-cream font-light mb-4">Spacing</h3>
              <div className="space-y-4">
                <div className="bg-primary-forest/30 p-2 rounded-[16px] text-primary-cream text-center">p-2</div>
                <div className="bg-primary-forest/30 p-4 rounded-[16px] text-primary-cream text-center">p-4</div>
                <div className="bg-primary-forest/30 p-6 rounded-[16px] text-primary-cream text-center">p-6</div>
                <div className="bg-primary-forest/30 p-8 rounded-[16px] text-primary-cream text-center">p-8</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
