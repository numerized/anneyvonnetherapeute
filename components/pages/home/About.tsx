export function About() {
  return (
    <section 
      className="bg-primary-dark py-24" 
      id="about"
      aria-labelledby="about-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            id="about-title"
            className="text-primary-cream text-4xl md:text-5xl font-light mb-3"
          >
            UNE VIE EN QUÊTE D'AMOUR PUR
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-primary-forest/80 rounded-[24px] p-8 md:p-12">
            <div className="space-y-6">
              <p className="text-primary-cream/90">
                Depuis toujours, je suis habitée par le besoin de comprendre et d'explorer la profondeur des relations humaines. Ma quête d'amour pur a façonné mon approche unique en thérapie relationnelle.
              </p>
              
              <p className="text-primary-cream/90">
                Forte d'un parcours diversifié et de vingt ans d'expérience, j'ai développé une méthode holistique qui unit corps, cœur et esprit.
              </p>
              
              <p className="text-primary-cream/90">
                Je crois que l'épanouissement est notre état naturel. Mon travail vise à libérer chacun de ses schémas limitants, ouvrant la voie à des relations authentiques. De séances personnalisées aux immersions thérapeutiques à Ibiza, j'accompagne mes clients vers une reconnexion profonde avec eux-mêmes et les autres.
              </p>
              
              <p className="text-primary-cream/90">
                Ma démarche singulière vous guide vers une vie en harmonie avec vos désirs profonds, transformant vos relations et votre rapport à l'amour.
              </p>
            </div>
            <div className="text-right mt-8">
              <span className="text-primary-teal text-2xl font-handwriting" aria-label="Signature">Anne-Yvonne Racine</span>
            </div>
          </div>

          <div className="relative">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#0F1A17]/60 from-5% via-primary-forest/50 via-50% to-primary-forest/20 z-10 rounded-[24px]" 
              aria-hidden="true"
            />
            <img
              src="/images/about.webp"
              alt="Espace thérapeutique paisible"
              className="rounded-[24px] w-full h-[600px] object-cover"
              width={800}
              height={600}
              loading="lazy"
            />
          </div>
        </div>

        <div className="text-center mt-12">
          <button 
            className="bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream px-8 py-3 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
            aria-label="En savoir plus sur mes services"
          >
            Découvrir mes services
          </button>
        </div>
      </div>
    </section>
  )
}
