'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { RadioGroup } from '@headlessui/react'

interface Question {
  id: string
  text: string
  emoji: string
  required?: boolean
}

const questions: Question[] = [
  {
    id: 'rapport_desir',
    text: "Comment ressentez-vous votre propre désir ?",
    emoji: '🌀',
    required: true
  },
  {
    id: 'aisance_corporelle',
    text: "Comment vivez-vous votre rapport au corps dans l'intimité ?",
    emoji: '🌿',
    required: true
  },
  {
    id: 'limites_blocages',
    text: "Lorsque quelque chose ne vous plaît pas dans l'intimité, vous avez tendance à…",
    emoji: '🚪',
    required: true
  },
  {
    id: 'rapport_plaisir',
    text: "Quelle place accordez-vous au plaisir dans votre vie ?",
    emoji: '🔥',
    required: true
  },
  {
    id: 'desirs_decouvertes',
    text: "Face à la nouveauté en matière de sexualité, vous êtes plutôt…",
    emoji: '💫',
    required: true
  }
]

const optionsMap = {
  rapport_desir: [
    { id: 'A', label: "Il est fluide et naturel, je l'accueille pleinement.", points: 4 },
    { id: 'B', label: "Il est parfois confus ou en dents de scie.", points: 3 },
    { id: 'C', label: "Il est souvent secondaire dans ma vie.", points: 2 },
    { id: 'D', label: "J'ai du mal à le percevoir ou à le laisser s'exprimer.", points: 1 }
  ],
  aisance_corporelle: [
    { id: 'A', label: "Avec aisance, j'apprécie explorer et ressentir.", points: 4 },
    { id: 'B', label: "Avec quelques freins, mais je cherche à les comprendre.", points: 3 },
    { id: 'C', label: "Avec retenue, j'ai du mal à me lâcher complètement.", points: 2 },
    { id: 'D', label: "Avec gêne, j'ai souvent envie d'éviter ces moments.", points: 1 }
  ],
  limites_blocages: [
    { id: 'A', label: "Exprimer clairement mes ressentis et besoins.", points: 4 },
    { id: 'B', label: "Hésiter, mais réussir à en parler après réflexion.", points: 3 },
    { id: 'C', label: "Me taire pour éviter de blesser ou perturber l'autre.", points: 2 },
    { id: 'D', label: "Me refermer et me sentir inconfortable.", points: 1 }
  ],
  rapport_plaisir: [
    { id: 'A', label: "Une place essentielle et assumée.", points: 4 },
    { id: 'B', label: "Une place importante mais parfois mise de côté.", points: 3 },
    { id: 'C', label: "Une place secondaire, le quotidien prend le dessus.", points: 2 },
    { id: 'D', label: "Une place floue, je ne sais pas comment m'y reconnecter.", points: 1 }
  ],
  desirs_decouvertes: [
    { id: 'A', label: "Curieux(se) et enthousiaste, j'aime explorer.", points: 4 },
    { id: 'B', label: "Prudent(e), mais ouvert(e) à ce qui me correspond.", points: 3 },
    { id: 'C', label: "Réservé(e), avec une préférence pour ce qui est connu.", points: 2 },
    { id: 'D', label: "Fermé(e) à toute idée de changement ou d'exploration.", points: 1 }
  ]
}

interface Result {
  range: [number, number]
  title: string
  emoji: string
  description: string
}

const results: Result[] = [
  {
    range: [17, 20],
    title: "Éros fluide et assumé",
    emoji: '🔸',
    description: "Vous êtes en harmonie avec votre désir et votre sensualité. Vous savez exprimer vos besoins et accueillir l'intimité comme un espace d'exploration et de partage. Vous cherchez à équilibrer plaisir et émotion avec aisance."
  },
  {
    range: [13, 16],
    title: "Éros en équilibre mais parfois en questionnement",
    emoji: '🔹',
    description: "Vous avez une bonne connexion à votre désir, mais certaines hésitations ou conditionnements peuvent encore freiner votre épanouissement. Vous êtes en chemin vers une sexualité plus alignée et consciente."
  },
  {
    range: [9, 12],
    title: "Éros en quête de sens",
    emoji: '🟠',
    description: "Vous ressentez parfois un décalage entre vos désirs profonds et leur expression. Peut-être avez-vous tendance à réprimer certains élans ou à prioriser d'autres aspects de votre vie. Une réflexion plus poussée pourrait vous aider à vous reconnecter à votre plaisir."
  },
  {
    range: [5, 8],
    title: "Éros en retrait",
    emoji: '🔻',
    description: "Votre rapport au désir semble bridé par des peurs, des blocages ou un manque de connexion à votre propre corps et à vos envies. Explorer votre relation à l'intimité avec douceur et curiosité pourrait vous permettre de renouer avec votre sensualité."
  },
  {
    range: [0, 4],
    title: "Éros en sommeil",
    emoji: '⚫',
    description: "Votre sexualité est actuellement en veille, soit par choix, soit par circonstances. Peut-être ressentez-vous de l'indifférence, du rejet ou de l'appréhension face au désir. Une introspection plus profonde et un accompagnement bienveillant pourraient vous aider à comprendre ce positionnement."
  }
]

function TestDesirErosPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [date] = useState(() => {
    return new Date().toISOString()
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>(() => {
    return questions.reduce((acc, question) => {
      acc[question.id] = ''
      return acc
    }, {} as { [key: string]: string })
  })
  const [fantasme, setFantasme] = useState('')
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    let totalPoints = 0
    questions.forEach(question => {
      const answer = answers[question.id]
      if (answer) {
        const questionOptions = optionsMap[question.id as keyof typeof optionsMap]
        const option = questionOptions.find(opt => opt.id === answer)
        if (option) {
          totalPoints += option.points
        }
      }
    })
    return totalPoints
  }

  const getResult = (score: number) => {
    return results.find(result => score >= result.range[0] && score <= result.range[1])
  }

  if (showResults) {
    const score = calculateScore()
    const result = getResult(score)

    return (
      <div className="min-h-screen bg-primary-forest text-primary-cream p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="!text-3xl !sm:text-4xl !md:text-5xl !lg:text-6xl !font-bold !text-primary-coral !mb-4 !leading-normal">
              Résultats de votre test
            </h1>
            <p className="text-primary-cream/80 mb-2">
              Ce test vous aide à mieux comprendre votre relation au désir et à l'intimité, pour un épanouissement plus conscient et authentique.
            </p>
          </div>
          
          <div className="bg-primary-cream/10 rounded-lg p-6 space-y-4">
            <div className="text-center">
              <p className="text-6xl mb-4">{result?.emoji}</p>
              <h2 className="text-2xl font-semibold text-primary-coral mb-2">
                {result?.title}
              </h2>
              <p className="text-primary-cream/80">
                {result?.description}
              </p>
            </div>
          </div>

          {fantasme && (
            <div className="bg-primary-cream/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-primary-coral mb-2">
                Votre fantasme exprimé
              </h3>
              <p className="text-primary-cream/80 italic">
                "{fantasme}"
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-forest text-primary-cream p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="!text-3xl !sm:text-4xl !md:text-5xl !lg:text-6xl !font-bold !text-primary-coral !mb-4 !leading-normal">
            Test d'Évaluation de votre Relation au Désir et à l'Éros
          </h1>
          <p className="text-primary-cream/80 mb-2">
            Ce test est conçu pour explorer vos facilités, difficultés, désirs et rejets en matière de sexualité et d'intimité, en toute introspection et sans jugement.
          </p>
          <p className="text-primary-cream/60 text-sm italic">
            100% confidentiel : Aucune donnée n'est stockée ni conservée
          </p>
        </div>

        <div className="bg-primary-cream/10 rounded-lg p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{currentQuestion.emoji}</span>
              <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
            </div>

            <RadioGroup
              value={answers[currentQuestion.id]}
              onChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
              className="space-y-3"
            >
              {optionsMap[currentQuestion.id as keyof typeof optionsMap].map((option) => (
                <RadioGroup.Option
                  key={option.id}
                  value={option.id}
                  className={({ active, checked }) =>
                    `${
                      active ? 'ring-2 ring-primary-coral ring-opacity-60 ring-offset-2 ring-offset-primary-forest' : ''
                    }
                    ${
                      checked ? 'bg-primary-coral/20 border-primary-coral text-primary-coral' : 'bg-primary-cream/5 border-primary-cream/20 text-primary-cream'
                    }
                    relative flex cursor-pointer rounded-lg px-5 py-4 border transition-all focus:outline-none`
                  }
                >
                  <RadioGroup.Label as="p" className="font-medium">
                    {option.label}
                  </RadioGroup.Label>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>

          {currentQuestionIndex === questions.length - 1 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-primary-coral">Fantasme (facultatif)</h3>
              <textarea
                value={fantasme}
                onChange={(e) => setFantasme(e.target.value)}
                placeholder="Exprimez ici un fantasme ou une envie particulière..."
                className="w-full h-32 bg-primary-cream/5 border border-primary-cream/20 rounded-lg p-3 text-primary-cream placeholder:text-primary-cream/40 focus:border-primary-coral focus:ring-primary-coral"
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-primary-cream/60 hover:text-primary-cream disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion.required && !answers[currentQuestion.id]}
              className="px-6 py-2 bg-primary-coral text-primary-cream rounded-full hover:bg-primary-rust transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Voir les résultats' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestDesirErosPageWrapper() {
  return (
    <Suspense fallback={null}>
      <TestDesirErosPage />
    </Suspense>
  )
}

export default TestDesirErosPageWrapper
