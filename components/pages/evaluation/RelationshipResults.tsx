'use client'

import { motion } from 'framer-motion'

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
    rarely: 0
  }

  Object.values(answers).forEach(answer => {
    if (counts[answer as keyof typeof counts] !== undefined) {
      counts[answer as keyof typeof counts]++
    }
  })

  // Determine the dominant pattern
  if (counts.often >= 12) {
    return {
      title: "L'Amoureux.se Intuitif.ve",
      description: `Tu possèdes une sensibilité exceptionnelle et une grande capacité d'empathie qui font de toi un.e partenaire particulièrement attentif.ve. Ta neurodiversité t'offre une perspective unique sur les relations, te permettant de ressentir et de comprendre les émotions à un niveau plus profond.`,
      strengths: [
        "Grande capacité d'empathie et d'intuition émotionnelle",
        "Authenticité et sincérité dans l'expression des sentiments",
        "Créativité dans la façon d'exprimer l'amour",
        "Sensibilité aux besoins non-exprimés"
      ],
      growthAreas: [
        "Risque de surinvestissement émotionnel",
        "Tendance à l'hyperanalyse des situations",
        "Besoin d'apprendre à poser des limites saines"
      ],
      advice: [
        "Continue à cultiver ta sensibilité tout en établissant des frontières émotionnelles saines",
        "Partage ouvertement ta façon unique de percevoir l'amour avec ton/ta partenaire",
        "N'oublie pas de prendre soin de toi autant que tu prends soin de l'autre"
      ]
    }
  } else if (counts.partially >= 12 || (counts.partially >= 8 && counts.often >= 6)) {
    return {
      title: "L'Amoureux.se en Exploration",
      description: `Tu es dans une phase d'apprentissage et de découverte de toi-même dans les relations. Ta neurodiversité t'apporte une perspective unique qui te permet de remettre en question les conventions relationnelles traditionnelles.`,
      strengths: [
        "Capacité d'adaptation et d'apprentissage",
        "Ouverture d'esprit et curiosité émotionnelle",
        "Authenticité dans la recherche de connexion",
        "Volonté de comprendre et de grandir"
      ],
      growthAreas: [
        "Confiance en ses intuitions relationnelles",
        "Expression plus directe des besoins et des attentes",
        "Gestion de l'anxiété dans les situations nouvelles"
      ],
      advice: [
        "Prends le temps d'explorer et de comprendre tes propres besoins relationnels",
        "N'hésite pas à communiquer tes particularités et tes besoins spécifiques",
        "Célèbre ta façon unique d'aimer et de créer des liens"
      ]
    }
  } else {
    return {
      title: "L'Amoureux.se en Transformation",
      description: `Tu es dans une période de transformation importante de ta vie relationnelle. Ta neurodiversité t'offre l'opportunité de réinventer complètement ta façon d'aborder les relations amoureuses.`,
      strengths: [
        "Capacité de remise en question et d'évolution",
        "Potentiel de créativité relationnelle inexploité",
        "Sensibilité et profondeur émotionnelle",
        "Authenticité dans la démarche de changement"
      ],
      growthAreas: [
        "Confiance en soi dans les situations relationnelles",
        "Expression des émotions et des besoins",
        "Gestion des situations d'intimité"
      ],
      advice: [
        "Commence par t'accepter tel.le que tu es, avec tes particularités",
        "Explore de nouvelles façons d'exprimer ton amour qui te correspondent",
        "N'hésite pas à chercher du soutien auprès de personnes qui comprennent ta neurodiversité"
      ]
    }
  }
}

export function RelationshipResults({ answers, onReset }: ResultsProps) {
  const profile = calculateProfile(answers)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-primary-coral/10 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-primary-coral mb-4">{profile.title}</h2>
        <p className="text-gray-700 mb-6">{profile.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-primary-forest mb-4">Tes forces relationnelles 💝</h3>
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
          <h3 className="text-xl font-semibold text-primary-forest mb-4">Tes zones de croissance 🌱</h3>
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
        <h3 className="text-xl font-semibold text-primary-forest mb-4">Conseils pour t'épanouir 🌟</h3>
        <ul className="space-y-3">
          {profile.advice.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary-coral">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 mb-6">
          N'oublie pas : ta façon d'aimer est unique et précieuse. Ta neurodiversité t'apporte une sensibilité et une profondeur particulières dans tes relations.
        </p>
        <button
          onClick={onReset}
          className="bg-primary-coral hover:bg-primary-coral/90 text-white px-8 py-3 rounded-full transition-all duration-200"
        >
          Refaire le test
        </button>
      </div>
    </motion.div>
  )
}
