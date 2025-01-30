'use client'

import { Clock, MessageCircle, Shield, Sparkles } from 'lucide-react'

import { ChatMessage } from '@/components/shared/ChatMessage'

export function AiCompanion() {
  return (
    <section className="py-16 bg-primary-forest">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-dark/50 text-primary-cream px-4 py-2 rounded-[24px] text-sm mb-4">
            VOTRE COMPAGNON THÉRAPEUTIQUE
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-primary-cream">
            AnneYvonne IA - Votre Guide Personnel
          </h2>
          <p className="text-primary-cream/80 max-w-3xl mx-auto">
            Bonjour, je suis l&apos;IA d&apos;AnneYvonne, entraînée sur 10 ans
            de notes personnelles, conférences et séances. Je suis là pour vous
            soutenir avec la même approche bienveillante et l&apos;humour
            qu&apos;AnneYvonne.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-primary-forest/40 rounded-3xl p-8 md:p-12">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <Clock className="text-primary-coral mt-1 w-10 h-10 flex-shrink-0" />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Disponible 24/24
                  </h3>
                  <p className="text-primary-cream/90">
                    Je suis là à tout moment pour écouter, comprendre et vous
                    guider avec la même approche de dédramatisation
                    qu&apos;AnneYvonne utilise dans ses séances.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <Shield className="text-primary-coral mt-1 w-10 h-10 flex-shrink-0" />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Expérience Personnalisée
                  </h3>
                  <p className="text-primary-cream/90">
                    Formée par des années d&apos;expérience thérapeutique, je
                    comprends les nuances de chaque situation et adapte mes
                    réponses à votre parcours unique.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <Sparkles className="text-primary-coral mt-1 w-10 h-10 flex-shrink-0" />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Approche Unique
                  </h3>
                  <p className="text-primary-cream/90">
                    Je partage l&apos;humour et la légèreté d&apos;AnneYvonne
                    tout en maintenant le sérieux nécessaire pour vous aider à
                    voir la vie sous un angle plus fluide.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <MessageCircle className="text-primary-coral mt-1 w-10 h-10 flex-shrink-0" />
                <div>
                  <h3 className="text-primary-coral font-bold mb-2">
                    Dialogue Authentique
                  </h3>
                  <p className="text-primary-cream/90">
                    Comme AnneYvonne, je crois au pouvoir de la conversation
                    authentique pour transformer les défis en opportunités de
                    croissance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <button
                className="w-full bg-primary-coral hover:bg-primary-rust transition-colors text-primary-cream rounded-md py-3 font-bold focus:outline-none focus:ring-2 focus:ring-primary-teal"
                aria-label="Chattez avec moi (disponible en 2025)"
              >
                Chattez avec moi (disponible en 2025)
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary-forest/80 backdrop-blur rounded-[32px] p-6 space-y-4 shadow-xl">
              {/* WhatsApp-style header */}
              <div className="flex items-center gap-3 pb-4 border-b border-primary-cream/10">
                <div className="w-10 h-10 rounded-full bg-primary-teal/20 flex-shrink-0 grid place-items-center">
                  <span
                    className="text-primary-teal"
                    aria-label="Initiales AnneYvonne"
                  >
                    AY
                  </span>
                </div>
                <div>
                  <h4 className="text-primary-cream font-medium">
                    AnneYvonne IA
                  </h4>
                  <p className="text-primary-cream/60 text-sm">En ligne</p>
                </div>
              </div>

              <div className="space-y-4 min-h-[300px] flex flex-col justify-end">
                <ChatMessage
                  isAI={false}
                  message="Je me sens submergé(e) par mes émotions..."
                  initials="MC"
                />

                <ChatMessage
                  isAI={true}
                  message="Ah, les émotions ! Comme je le dis souvent, c'est comme un grand spectacle où parfois on se retrouve à jouer tous les rôles 😊 Prenons un moment pour regarder ça ensemble ? Qu'est-ce qui vous fait sourire, même un tout petit peu, dans cette situation ?"
                  initials="AY"
                />

                <ChatMessage
                  isAI={false}
                  message="Je ne l'avais pas vu comme ça... C'est vrai que c'est un peu comme du théâtre parfois 😊"
                  initials="MC"
                />

                <ChatMessage
                  isAI={true}
                  message="Voilà ! Et comme au théâtre, on peut choisir comment on joue notre rôle. Voulez-vous explorer ensemble comment transformer ce drame en comédie légère ?"
                  initials="AY"
                />
              </div>

              {/* WhatsApp-style input */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-primary-cream/10">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  disabled
                  className="flex-1 bg-primary-forest/30 rounded-full px-4 py-2 text-primary-cream placeholder:text-primary-cream/40 focus:outline-none focus:ring-2 focus:ring-primary-teal text-sm"
                />
                <button
                  disabled
                  className="w-10 h-10 rounded-full bg-primary-teal/20 grid place-items-center text-primary-teal hover:bg-primary-teal/30 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center w-full">
              <p className="text-primary-cream/60 text-sm">
                Une conversation avec l&apos;IA d&apos;AnneYvonne
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
