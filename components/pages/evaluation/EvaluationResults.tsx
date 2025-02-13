'use client'

import Link from 'next/link'

interface RatingSection {
  [key: string]: string
}

interface EvaluationResultsProps {
  socialRatings: RatingSection
  intimateRatings: RatingSection
}

interface ResultCategory {
  range: string
  title: string
  description: string
  advice: string[]
}

const socialCategories: ResultCategory[] = [
  {
    range: "0-2.9",
    title: "Forte dépendance sociale",
    description: "Vous pourriez avoir des difficultés à maintenir votre autonomie dans vos relations sociales.",
    advice: [
      "Analysez vos motivations : Posez-vous la question de savoir pourquoi vous recherchez systématiquement l'approbation des autres.",
      "Pratiquez de petites prises de décision autonomes : Commencez par des choix sans enjeu majeur.",
      "Exposez-vous progressivement à la solitude : Réservez un moment dans la journée pour une activité en solo."
    ]
  },
  {
    range: "3-5.9",
    title: "Équilibre fragile",
    description: "Vous êtes sur le chemin d'un équilibre social, mais des ajustements peuvent être nécessaires.",
    advice: [
      "Renforcez vos zones de progrès : Identifiez les situations où vous avez du mal à poser des limites.",
      "Équilibrez l'aide et l'indépendance : Acceptez l'aide des autres quand cela est pertinent.",
      "Exploitez vos forces sociales : Utilisez votre capacité à écouter et à collaborer."
    ]
  },
  {
    range: "6-8.9",
    title: "Équilibre relatif",
    description: "Vous parvenez à conjuguer indépendance et sociabilité saine.",
    advice: [
      "Maintenez vos bonnes pratiques tout en restant vigilant aux changements.",
      "Partagez votre expérience avec d'autres qui pourraient en bénéficier.",
      "Continuez à cultiver vos relations tout en préservant votre autonomie."
    ]
  },
  {
    range: "9-10",
    title: "Tendance à l'isolement",
    description: "Tendance marquée à l'isolement ou à une indépendance excessive.",
    advice: [
      "Reconsidérez vos priorités sociales : Évaluez si cette indépendance totale améliore réellement votre qualité de vie.",
      "Pratiquez la flexibilité : Engagez-vous à laisser de la place à l'avis des autres.",
      "Diversifiez vos interactions : Participez à des activités de groupe ou à des projets collaboratifs."
    ]
  }
]

const intimateCategories: ResultCategory[] = [
  {
    range: "0-2.9",
    title: "Forte dépendance affective",
    description: "Forte dépendance affective ou amoureuse, avec une difficulté à affirmer vos besoins dans la relation.",
    advice: [
      "Apprenez à formuler vos besoins : Identifiez vos émotions et exprimez-les.",
      "Travaillez sur vos limites : Prenez l'habitude de dire 'non' dans des situations anodines.",
      "Construisez une vision personnelle : Réfléchissez à vos propres objectifs et désirs."
    ]
  },
  {
    range: "3-5.9",
    title: "Équilibre précaire",
    description: "Vous commencez à naviguer entre autonomie et connexion, mais des points méritent attention.",
    advice: [
      "Affinez votre équilibre émotionnel : Cherchez des façons de mieux synchroniser vos besoins.",
      "Gérez les conflits intelligemment : Privilégiez des discussions orientées sur les solutions.",
      "Consolidez votre vision commune : Discutez régulièrement pour ajuster vos attentes."
    ]
  },
  {
    range: "6-8.9",
    title: "Bonne harmonie",
    description: "Bonne harmonie entre autonomie et engagement affectif.",
    advice: [
      "Continuez à cultiver cette harmonie tout en restant attentif aux changements.",
      "Partagez votre expérience positive avec votre partenaire.",
      "Maintenez le dialogue ouvert sur vos besoins mutuels."
    ]
  },
  {
    range: "9-10",
    title: "Indépendance excessive",
    description: "Tendance marquée à l'indépendance, pouvant limiter l'intimité ou la connexion émotionnelle.",
    advice: [
      "Évaluez le coût émotionnel de votre indépendance dans vos relations.",
      "Travaillez la vulnérabilité : Pratiquez l'ouverture émotionnelle.",
      "Investissez dans l'intimité : Réservez du temps intentionnel pour des moments de qualité."
    ]
  }
]

function calculateAverage(ratings: RatingSection): number {
  const values = Object.values(ratings)
  const sum = values.reduce((acc, val) => acc + parseInt(val), 0)
  return sum / values.length
}

function getCategory(average: number, categories: ResultCategory[]): ResultCategory {
  for (const category of categories) {
    const [min, max] = category.range.split('-').map(Number)
    if (average >= min && average <= max) {
      return category
    }
  }
  return categories[categories.length - 1] // Default to last category
}

export function EvaluationResults({ socialRatings, intimateRatings }: EvaluationResultsProps) {
  const socialAverage = calculateAverage(socialRatings)
  const intimateAverage = calculateAverage(intimateRatings)

  const socialCategory = getCategory(socialAverage, socialCategories)
  const intimateCategory = getCategory(intimateAverage, intimateCategories)

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Résultats de votre évaluation</h2>
      
      {/* Social Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-coral">Section Sociale</h3>
        <p className="text-lg font-medium text-primary-coral">Score moyen : {socialAverage.toFixed(1)} / 10</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-800">{socialCategory.title}</h4>
          <p className="text-gray-600 mt-2">{socialCategory.description}</p>
          <div className="mt-4">
            <h5 className="font-medium text-gray-800 mb-2">Conseils personnalisés :</h5>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {socialCategory.advice.map((advice, index) => (
                <li key={index}>{advice}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Intimate Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary-coral">Section Intime et Amoureuse</h3>
        <p className="text-lg font-medium text-primary-coral">Score moyen : {intimateAverage.toFixed(1)} / 10</p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-gray-800">{intimateCategory.title}</h4>
          <p className="text-gray-600 mt-2">{intimateCategory.description}</p>
          <div className="mt-4">
            <h5 className="font-medium text-gray-800 mb-2">Conseils personnalisés :</h5>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {intimateCategory.advice.map((advice, index) => (
                <li key={index}>{advice}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Welcome Gift Section */}
      <div className="mt-8 p-6 bg-primary-coral/10 rounded-lg border-2 border-primary-coral/20">
        <h3 className="text-xl font-bold text-primary-coral mb-2">🎁 Cadeau de bienvenue</h3>
        <p className="text-gray-700 mb-4">
          Pour vous remercier de votre inscription, bénéficiez de 10% de réduction sur notre offre de lancement avec le code :
        </p>
        <div className="bg-white p-4 rounded-lg text-center mb-4">
          <span className="text-2xl font-bold text-primary-coral">COEUR180</span>
        </div>
        <div className="text-center">
          <Link 
            href="/prochainement?coupon=COEUR180"
            className="inline-block bg-primary-coral hover:bg-primary-rust transition-colors text-white font-semibold px-6 py-3 rounded-lg"
          >
            Découvrir l'offre
          </Link>
        </div>
      </div>
    </div>
  )
}
