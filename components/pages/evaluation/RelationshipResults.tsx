'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

import { PurchaseTicket } from '@/components/pages/prochainement/PurchaseTicket'

interface ResultsProps {
  answers: Record<string, string>
  onReset: () => void
}

interface Profile {
  title: string
  description: string
  strengths: string[]
  growthAreas: string[]
  advice: string[]
}

const calculateProfile = (answers: Record<string, string>): Profile => {
  // Count the frequency of each answer type
  const counts = {
    often: 0,
    partially: 0,
    rarely: 0,
  }

  Object.values(answers).forEach((answer) => {
    if (counts[answer as keyof typeof counts] !== undefined) {
      counts[answer as keyof typeof counts]++
    }
  })

  // Determine the profile based on the new score ranges
  if (counts.often >= 12 && counts.often <= 18) {
    return {
      title: "L'AMOUREUX RÊVÉ (ou IDEAL)",
      description: `<p>"Tu incarnes l'amoureux idéal ! Pour toi, la relation amoureuse est bien plus qu'un simple engagement ; c'est un projet ambitieux, teinté de passion et d'engagement. Que tu l'aies déjà trouvé.e ou non, espérons que tu rencontreras cette perle rare capable d'apprécier ta personnalité déjà bien affirmée et ton désir de relation mature."</p>

<p>L'amoureux idéal se distingue par sa capacité à s'accepter tel qu'il est et par son inclination naturelle à donner avant de recevoir, tout en sachant également exprimer ses propres besoins. Il sait parfaitement articuler ses sentiments, ses désirs et ses préoccupations de manière claire et respectueuse.</p>

<p>Il démontre une remarquable capacité à saisir les émotions et les perspectives de son partenaire, lui permettant ainsi d'être compatissant et attentionné. Sensible aux besoins émotionnels de l'autre, il s'efforce de les satisfaire avec délicatesse.</p>

<p>Doté d'une aptitude à tisser et à entretenir des relations saines et équilibrées, il sait instaurer un climat de confiance, de respect et d'intimité au sein de la relation. Face aux désaccords et aux tensions, il sait faire preuve de maturité en les abordant de manière constructive, préférant la confrontation ouverte à l'évitement.</p>

<p>Flexible et adaptable, il sait naviguer avec aisance à travers les changements et les défis rencontrés dans la relation. Son engagement constant démontre dévouement, loyauté et soutien, quels que soient les hauts et les bas. Conscient de l'importance des signaux non verbaux, il sait renforcer la connexion avec son partenaire.</p>

<p class="text-center">* * *</p>

<p>Si tu te retrouves dans cette description, le cheminement relationnel est une aventure sans fin, un voyage courageux et ambitieux qui demande une adaptation constante à chaque étape de la vie et à chaque rencontre.</p>

<p>L'amour est dynamique, en perpétuelle évolution, et ne peut être enfermé dans des schémas figés. Si tu souhaites poursuivre ce voyage, n'hésite pas à continuer à explorer, car c'est dans la quête de compréhension et d'authenticité que se trouve la véritable richesse de l'amour.</p>

<p>Rappelle-toi qu'il est crucial de prendre en considération tes propres sentiments et de discerner parmi ces descriptions ce qui te convient et ce qui ne résonne pas avec toi !</p>`,
      strengths: [
        "Excellente capacité de communication et d'écoute active",
        'Grande empathie et compréhension émotionnelle',
        'Aptitude à créer des relations saines et équilibrées',
        'Flexibilité et adaptabilité dans la gestion des défis',
        'Engagement et loyauté constants',
      ],
      growthAreas: [
        'Attentes élevées envers soi-même et le partenaire',
        "Difficulté à accepter l'imperfection chez l'autre",
        'Tendance au surinvestissement émotionnel',
        'Besoin de contrôle dans la relation',
        'Difficulté à exprimer ses propres besoins',
      ],
      advice: [
        'Réévalue tes attentes : Cherche un équilibre entre tes aspirations et la réalité de la relation.',
        'Cultive la compassion : Accepte les imperfections, les tiennes comme celles de ton partenaire.',
        'Établis des limites saines : Évite le surinvestissement émotionnel tout en préservant ton bien-être.',
        "Pratique le lâcher-prise : Fais confiance et laisse de l'espace à ton partenaire.",
        "Communique avec authenticité : Exprime tes besoins tout en restant à l'écoute de l'autre.",
      ],
    }
  } else if (counts.often >= 6 && counts.often < 12) {
    return {
      title: "L'AMOUREUX INVESTI",
      description: `<p>"Tu progresses admirablement ! 
Continue sur cette voie, tu fais de grands pas dans la bonne direction !"</p>

<p>L'amoureux investi est motivé, il aspire à une relation épanouissante mais peut éprouver des difficultés à la construire et à la maintenir.</p>

<p>Il souhaite généralement offrir à son partenaire affection, soutien et engagement, mais il peut manquer de compétences relationnelles ou de compréhension sur la manière de les mettre en pratique. Son potentiel est en train de s'épanouir, naviguant entre des extrêmes, mais il demeure encore trop incertain quant à sa propre valeur pour pleinement s'engager.</p>

<p>Même s'il est capable d'empathie et d'appréhender la proximité avec autrui, il a parfois tendance à analyser de manière excessive et à porter des jugements sur ce qu'il ne parvient pas à saisir pleinement.</p>

<p>Bien qu'il puisse remettre parfois en question ses convictions, il est également possible qu'il s'attache fermement à ses idées sur la façon de vivre la relation. De plus, il pourrait utiliser différents mécanismes pour gérer efficacement ses multiples émotions, comme revêtir des "masques" qui lui permettent d'aborder les situations avec plus de clarté et de stabilité émotionnelle.</p>

<p>Qu'il évite le conflit ou le confronte ouvertement, cela reflète toujours un besoin profond qu'il cherche à exprimer, même si parfois il ne trouve pas la meilleure manière de le faire. Son désir de bâtir une relation dynamique et respectueuse des différences de chacun se trouve parfois confronté aux ajustements ou aux changements que la relation peut exiger.</p>

<p>Son authentique volonté de réussir dans sa relation peut parfois être mal interprété par son partenaire comme de l'hésitation, même s'il s'efforce activement de mieux gérer ses fluctuations émotionnelles et les incertitudes qui le tourmentent. Sa grande faculté d'adaptation se révèle être un atout indéniable dans le jeu de la séduction, mais ce penchant caméléon peut parfois lui faire perdre de vue sa véritable essence.</p>

<p class="text-center">* * *</p>

<p>Si tu te reconnais dans cette description, cela signifie que tu possèdes la capacité profonde d'ouvrir ton cœur et de t'engager dans une relation authentique et enrichissante, même si celle-ci peut te sembler encore incomplète ou contraignante. Tu navigues entre le désir de liberté et celui d'attachement, et il t'appartient de clarifier tes véritables aspirations.</p>

<p>C'est une invitation à explorer et à comprendre tes propres besoins et désirs, à équilibrer tes envies d'indépendance avec ton besoin de connexion émotionnelle. En te connectant avec tes aspirations les plus profondes, tu pourras trouver la voie vers une relation qui te comble et t'épanouisse pleinement.</p>

<p>Rappelle-toi qu'il est crucial de prendre en considération tes propres sentiments et de discerner parmi ces descriptions ce qui te convient et ce qui ne résonne pas avec toi !</p>`,
      strengths: [
        "Motivation et désir d'épanouissement relationnel",
        "Capacité d'empathie et d'adaptation",
        "Volonté d'offrir affection et soutien",
        'Remise en question constructive',
        "Grande faculté d'adaptation",
      ],
      growthAreas: [
        'Gestion des émotions et des incertitudes',
        "Tendance à l'analyse excessive",
        'Difficulté à maintenir son authenticité',
        'Expression des besoins personnels',
        'Équilibre entre liberté et engagement',
      ],
      advice: [
        'Cultive la confiance en toi et en ta valeur personnelle',
        'Développe une communication plus directe et authentique',
        "Trouve l'équilibre entre adaptation et authenticité",
        'Accepte que la croissance relationnelle prend du temps',
        'Explore tes besoins profonds sans jugement',
      ],
    }
  } else {
    return {
      title: "L'AMOUREUX DÉBUTANT",
      description: `<p>"Une nouvelle opportunité ! 
On recommence depuis le début avec optimisme ! 
L'aventure de l'amour commence !"</p>

<p>Qu'il ait déjà vécu des aventures et/ou des histoires d'amour ou non, l'amoureux apprenti est encore maladroit !</p>

<p>C'est celui qui ne maîtrise pas encore ses désirs et ses élans, il est en attente de quelque chose de peu défini et ne sait pas très bien comment se positionner dans une relation, ou il le fait de manière maladroite.</p>

<p>Il est souvent rempli de bonnes intentions et en même temps, il a peut-être beaucoup d'attentes précises, peut-être trop précises pour donner « de la place » à l'autre. Son manque d'assurance l'empêche à répondre aux attentes et aux besoins émotionnels de son partenaire. Il peut manquer de disponibilité émotionnelle, de communication ouverte et sincère, ou de capacité à soutenir son partenaire dans les moments difficiles.</p>

<p>Son désir de sur-adaptation peut dissimuler sa véritable nature, il porte des masques qui limitent l'accès à l'autre. Son engagement peut sembler superficiel ou intermittent, et il peut avoir du mal à exprimer ses sentiments ou à faire preuve d'empathie.</p>

<p>Il se peut que ses certitudes et ses croyances sur le couple/la relation aient tendance à bloquer la relation dans des modèles peu flexibles. Le débutant en amour cherche souvent à se protéger, il manque de confiance en lui et dans sa possibilité d'être aimé.</p>

<p>Son hésitation émotionnelle provoque souvent des réactions d'éloignement ou de rejet de l'autre.</p>

<p class="text-center">* * *</p>

<p>Si tu te retrouves dans cette description, c'est que tu as encore du chemin à faire avant de t'aimer suffisamment, d'assumer ta personnalité dans toutes tes diversités pour te montrer dans ta véritable dimension et « oser l'autre » avec plus de confiance en toi, en l'amour et en la vie que tu vis.</p>

<p>Rappelle-toi qu'il est crucial de prendre en considération tes propres sentiments et de discerner parmi ces descriptions ce qui te convient et ce qui ne résonne pas avec toi !</p>`,
      strengths: [
        'Capacité à recommencer avec optimisme',
        'Bonnes intentions dans la relation',
        "Désir d'apprendre et de progresser",
        'Sensibilité aux besoins des autres',
        'Potentiel de croissance important',
      ],
      growthAreas: [
        'Manque de maîtrise des désirs et élans',
        'Difficultés à se positionner dans la relation',
        'Manque de disponibilité émotionnelle',
        'Tendance à la sur-adaptation',
        'Manque de confiance en soi',
      ],
      advice: [
        "Apprends à te connaître et à t'accepter tel que tu es",
        'Développe ta confiance en toi progressivement',
        'Exprime tes sentiments avec authenticité',
        'Reste patient dans ton apprentissage relationnel',
        'Cultive ton optimisme naturel',
      ],
    }
  }
}

export function RelationshipResults({ answers, onReset }: ResultsProps) {
  const profile = calculateProfile(answers)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-primary-coral/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-primary-coral mb-4">
          {profile.title}
        </h2>
        <div
          dangerouslySetInnerHTML={{ __html: profile.description }}
          className="text-gray-700 mb-6"
        ></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-primary-forest mb-4">
            Tes forces relationnelles 💝
          </h3>
          <ul className="space-y-3">
            {profile.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary-coral">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-primary-forest mb-4">
            Tes zones de croissance 🌱
          </h3>
          <ul className="space-y-3">
            {profile.growthAreas.map((area, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary-coral">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-primary-forest mb-4">
          Conseils pour t'épanouir 🌟
        </h3>
        <ul className="space-y-3">
          {profile.advice.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary-coral">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#FFF5F5] rounded-2xl p-8">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-primary-forest mb-2 flex items-center justify-center gap-2">
              <span role="img" aria-label="gift">
                🎁
              </span>
              Cadeau de bienvenue
            </h3>
            <p className="text-gray-600 mb-4">
              Pour vous remercier de votre inscription, bénéficiez de 10% de
              réduction sur notre offre de lancement avec le code :
            </p>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm mx-auto max-w-xs">
              <span className="text-2xl font-semibold text-primary-coral">
                COEUR180
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/prochainement?coupon=COEUR180"
              className="inline-block bg-[#E9A6A0] hover:bg-[#E9A6A0]/90 text-white px-8 py-3 rounded-full transition-all duration-200"
            >
              Découvrir l'offre
            </Link>
            <button
              onClick={onReset}
              className="block mx-auto text-gray-600 hover:text-primary-coral transition-colors duration-200"
            >
              Refaire le test
            </button>
          </div>
        </div>
      </div>

      {showPurchaseModal && (
        <PurchaseTicket
          ticketType="standard"
          onClose={() => setShowPurchaseModal(false)}
          defaultCouponCode="COEUR180"
        />
      )}
    </motion.div>
  )
}
