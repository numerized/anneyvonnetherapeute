export function About() {
  return (
    <section 
      className="bg-primary-dark py-6" 
      id="about"
      aria-labelledby="about-title"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-teal text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
            À PROPOS
          </div>
          <h2 
            id="about-title"
            className="text-3xl md:text-4xl font-light mb-4 text-primary-coral"
          >
            Une vie en quête d'amour pur
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-0 md:gap-12 items-start">
          <div className="bg-primary-forest/80 rounded-[24px] p-8 md:p-12">
            <div className="space-y-6">
              <p className="text-primary-cream/90">
                Depuis toujours, je suis habitée par le besoin de comprendre et d&apos;explorer la profondeur des relations humaines. Ma quête d&apos;amour pur a façonné mon approche unique en thérapie relationnelle.
              </p>
              <p className="text-primary-cream/90">
                Forte d&apos;un parcours diversifié et de vingt ans d&apos;expérience, j&apos;ai développé une méthode holistique qui unit corps, cœur et esprit.
              </p>
              <p className="text-primary-cream/90">
                Je crois que l&apos;épanouissement est notre état naturel. Mon travail vise à libérer chacun de ses schémas limitants, ouvrant la voie à des relations authentiques. De séances personnalisées aux immersions thérapeutiques à Ibiza, j&apos;accompagne mes clients vers une reconnexion profonde avec eux-mêmes et les autres.
              </p>
              <p className="text-primary-cream/90">
                Ma démarche singulière vous guide vers une vie en harmonie avec vos désirs profonds, transformant vos relations et votre rapport à l&apos;amour.
              </p>
            </div>
            <div className="text-right mt-8">
              <span className="text-primary-teal text-2xl font-handwriting" aria-label="Signature">Anne Yvonne Racine</span>
            </div>
          </div>

          <div className="relative mx-auto md:mx-8 max-w-[300px] mt-[60px]">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#0F1A17]/60 from-5% via-primary-forest/50 via-50% to-primary-forest/20 z-10 rounded-[24px]" 
              aria-hidden="true"
            />
            <img
              src="/images/about.webp"
              alt="Espace thérapeutique paisible"
              className="rounded-[24px] w-full aspect-[3/5] object-cover"
              width={300}
              height={500}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
