import Image from 'next/image'

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
              <div className="space-y-4 text-primary-cream">
                <div>
                  <h3 className="text-xl font-light text-primary-coral mb-1">
                    UNE HISTOIRE D'ENGAGEMENT
                  </h3>
                  <p className="text-base mb-3">
                    Anne Yvonne Racine et Cœurs à Corps, en quelques
                    phrases.
                  </p>
                </div>

                <div className="space-y-3 text-primary-cream/90 text-sm">
                  <p>
                    Depuis plus de 50 ans, ma vie et mon parcours
                    professionnel m'ont guidée vers une quête essentielle
                    pour moi, de mieux: comprendre, d'explorer profondément
                    et de transformer la manière dont nous nous relions à
                    nous-mêmes, aux autres et au monde.
                  </p>
                  <p>
                    Avec Cœur à Corps, je rassemble tout ce que mes
                    expériences de vie et mon engagement thérapeutique m'ont
                    appris pour offrir une plateforme dédiée à la Nouvelle
                    Relation. Une relation qui ne se limite plus à la simple
                    réaction, mais qui s'ouvre à une conscience profonde des
                    enjeux individuels et collectifs.
                  </p>
                  <p>
                    Cette démarche s'articule autour de trois axes
                    fondamentaux : Amour, Désir et Esprit. Ensemble, ils
                    nous invitent à retourner à la source de notre désir
                    d'amour, à explorer ce qui nous anime vraiment et à
                    grandir, à la fois individuellement et dans nos
                    relations.
                  </p>
                  <p>
                    Cœur à Corps propose un espace unique,{' '}
                    <span className="font-medium">
                      UNE CONVERSION à 180 DEGRES D'AMOUR
                    </span>{' '}
                    conçue avec des personnes incroyables dans une
                    atmosphère que je ne pensais pas pouvoir un jour
                    connaitre. Un espace conçu pour offrir à chacun la
                    liberté et la tranquillité nécessaires d'avancer, à son
                    rythme et là où il a le désir d'aller.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right mt-8">
              <span
                className="text-primary-teal text-2xl font-handwriting"
                aria-label="Signature"
              >
                Anne Yvonne Racine
              </span>
            </div>
          </div>

          <div className="relative mx-auto md:mx-8 max-w-[300px] mt-[60px]">
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0F1A17]/60 from-5% via-primary-forest/50 via-50% to-primary-forest/20 z-10 rounded-[24px]"
              aria-hidden="true"
            />
            <Image
              src="/images/anneyv-presentation2.webp"
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
